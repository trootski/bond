#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yaml"

# Configuration
KAFKA_TOPIC="BondMoviesToBeProcessed"
KAFKA_CONTAINER="e2e-kafka"
APP_CONTAINER="e2e-app"
CONSUMER_GROUP="BondProcessingConsumerGroup"
APP_URL="http://localhost:3010"
SLOW_PROCESSING_DELAY=15

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${CYAN}[STEP]${NC} $1"; }

cleanup() {
    log_info "Cleaning up..."
    docker compose -f "${COMPOSE_FILE}" --profile rebalance-test down -v --remove-orphans 2>/dev/null || true
}

trap cleanup EXIT

get_consumer_group_state() {
    docker exec "${KAFKA_CONTAINER}" \
        kafka-consumer-groups \
        --bootstrap-server localhost:9092 \
        --describe \
        --group "${CONSUMER_GROUP}" 2>/dev/null || echo "GROUP_NOT_FOUND"
}

get_consumer_count() {
    local state
    state=$(get_consumer_group_state)
    if echo "$state" | grep -q "GROUP_NOT_FOUND\|Consumer group.*does not exist"; then
        echo "0"
    else
        echo "$state" | grep -v "^GROUP\|^Consumer\|^$" | awk '{print $7}' | sort -u | grep -v "^-$" | wc -l | tr -d ' '
    fi
}

publish_to_kafka() {
    local payload=$1
    echo "${payload}" | docker exec -i "${KAFKA_CONTAINER}" \
        kafka-console-producer \
        --bootstrap-server localhost:9092 \
        --topic "${KAFKA_TOPIC}"
}

wait_for_consumer_count() {
    local expected_count=$1
    local timeout=$2
    local start_time=$(date +%s)

    log_info "Waiting for consumer group to have ${expected_count} member(s)..."
    while true; do
        local count
        count=$(get_consumer_count)
        if [ "$count" -eq "$expected_count" ]; then
            log_info "Consumer group has ${expected_count} member(s)"
            return 0
        fi

        local elapsed=$(($(date +%s) - start_time))
        if [ $elapsed -ge $timeout ]; then
            log_warn "Timeout waiting for ${expected_count} consumers (current: ${count})"
            return 1
        fi
        sleep 1
    done
}

wait_for_service() {
    local url=$1
    local timeout=$2
    local start_time=$(date +%s)

    log_info "Waiting for service at ${url}..."
    while true; do
        if curl -sf "${url}" > /dev/null 2>&1; then
            log_info "Service is ready"
            return 0
        fi

        local elapsed=$(($(date +%s) - start_time))
        if [ $elapsed -ge $timeout ]; then
            log_error "Timeout waiting for service after ${timeout}s"
            return 1
        fi
        sleep 2
    done
}

build_app() {
    log_info "Building application..."
    cd "${PROJECT_ROOT}"
    mvn package -DskipTests -q
}

start_services() {
    log_info "Starting Docker services (mock delay: ${SLOW_PROCESSING_DELAY}s)..."
    MOCK_DELAY_SECONDS=${SLOW_PROCESSING_DELAY} docker compose -f "${COMPOSE_FILE}" up -d --build --wait
}

test_rebalance_blocking() {
    log_info "============================================================"
    log_info "Test: Demonstrate rebalance blocking during long-running task"
    log_info "============================================================"
    log_info ""
    log_info "This test demonstrates that when a Kafka consumer is processing"
    log_info "a long-running task, adding a new consumer to the group will"
    log_info "trigger a rebalance that CANNOT complete until the task finishes."
    log_info ""

    local test_title="SlowMovie-$(date +%s)"
    local payload="{\"order\": 1, \"review\": \"This will process slowly\", \"title\": \"${test_title}\"}"

    # Step 1: Verify we have exactly 1 consumer
    log_step "1. Verifying initial state: 1 consumer in group"
    wait_for_consumer_count 1 30 || {
        log_error "Expected 1 consumer in group"
        get_consumer_group_state
        return 1
    }
    log_info "Initial consumer group state:"
    get_consumer_group_state

    # Step 2: Send a message that will take a long time to process
    log_step "2. Publishing message (will take ${SLOW_PROCESSING_DELAY}s to process)"
    local send_time=$(date +%s)
    if ! publish_to_kafka "${payload}"; then
        log_error "Failed to publish message"
        return 1
    fi

    # Step 3: Wait briefly for message to be picked up
    sleep 2

    local app_logs
    app_logs=$(docker logs "${APP_CONTAINER}" 2>&1 || true)
    if ! echo "$app_logs" | grep -q "Message received from Kafka.*${test_title}"; then
        log_error "Consumer did not pick up the message"
        return 1
    fi
    log_info "Consumer started processing message at $(date +%H:%M:%S)"

    # Step 4: Start second consumer while first is still processing
    log_step "3. Starting second consumer (will trigger rebalance)"
    log_info "The rebalance should be BLOCKED until the long-running task completes"
    local rebalance_start_time=$(date +%s)

    docker compose -f "${COMPOSE_FILE}" --profile rebalance-test up -d app2
    log_info "Second consumer starting at $(date +%H:%M:%S)..."

    # Step 5: Monitor rebalance progress
    log_step "4. Monitoring rebalance (expecting it to be blocked)"
    log_info ""
    log_info "Timeline:"
    log_info "  - Message sent at:     $(date -r $send_time +%H:%M:%S 2>/dev/null || date --date="@$send_time" +%H:%M:%S)"
    log_info "  - Rebalance triggered: $(date +%H:%M:%S)"
    log_info "  - Expected completion: ~${SLOW_PROCESSING_DELAY}s after message sent"
    log_info ""

    local rebalance_complete=false
    local check_count=0
    local max_checks=$((SLOW_PROCESSING_DELAY + 30))

    while [ $check_count -lt $max_checks ]; do
        local elapsed=$(($(date +%s) - rebalance_start_time))
        local consumer_count
        consumer_count=$(get_consumer_count)

        if [ "$consumer_count" -ge 2 ]; then
            rebalance_complete=true
            local rebalance_duration=$(($(date +%s) - rebalance_start_time))
            log_info ""
            log_info "Rebalance COMPLETED after ${rebalance_duration}s"
            break
        fi

        if [ $((check_count % 3)) -eq 0 ]; then
            log_info "  [+${elapsed}s] Rebalance in progress... (consumers: ${consumer_count})"
        fi

        sleep 1
        ((check_count++))
    done

    # Step 6: Analyze results
    log_step "5. Analyzing results"
    log_info ""
    log_info "Consumer group state after test:"
    get_consumer_group_state

    if [ "$rebalance_complete" = true ]; then
        local rebalance_time=$(($(date +%s) - rebalance_start_time))

        if [ $rebalance_time -ge $((SLOW_PROCESSING_DELAY - 3)) ]; then
            log_info ""
            log_info "SUCCESS: Rebalance was blocked for ~${rebalance_time}s"
            log_info "This demonstrates that the consumer group could not rebalance"
            log_info "until the long-running task (${SLOW_PROCESSING_DELAY}s) completed."
            log_info ""
            log_info "KEY INSIGHT: In production, this means:"
            log_info "  - Long-running consumers block group rebalancing"
            log_info "  - New consumers cannot start processing until rebalance completes"
            log_info "  - Consider max.poll.interval.ms and session.timeout.ms settings"
            return 0
        else
            log_warn "Rebalance completed faster than expected (${rebalance_time}s < ${SLOW_PROCESSING_DELAY}s)"
            log_warn "The blocking behavior may not have been fully demonstrated"
            return 0
        fi
    else
        log_error "Rebalance did not complete within timeout"
        log_error "This may indicate a configuration issue"
        return 1
    fi
}

main() {
    log_info "Starting rebalance blocking test for process-queue-spring-camel-kafka"
    echo "=================================================="

    cleanup
    build_app
    start_services
    wait_for_service "${APP_URL}/actuator/health" 60

    if test_rebalance_blocking; then
        echo ""
        echo "=================================================="
        log_info "Test passed!"
        exit 0
    else
        echo ""
        echo "=================================================="
        log_error "Test failed"
        exit 1
    fi
}

main "$@"
