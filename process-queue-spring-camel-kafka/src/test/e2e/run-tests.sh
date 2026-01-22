#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yaml"

# Configuration
KAFKA_TOPIC="BondMoviesToBeProcessed"
KAFKA_CONTAINER="e2e-kafka"
APP_URL="http://localhost:3010"
TIMEOUT_SECONDS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cleanup() {
    log_info "Cleaning up..."
    docker compose -f "${COMPOSE_FILE}" down -v --remove-orphans 2>/dev/null || true
}

trap cleanup EXIT

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
    log_info "Starting Docker services..."
    docker compose -f "${COMPOSE_FILE}" up -d --build --wait
}

test_enqueue_message() {
    local test_title="Goldfinger-$(date +%s)"
    local test_order=1
    local test_review="A classic Bond film"

    log_info "Test: Enqueue message and verify in Kafka"

    # Send message to enqueue endpoint
    log_info "Sending POST request to enqueue endpoint..."
    local http_status
    http_status=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "${APP_URL}/v1/bond-movie-events/review-updates/enqueue" \
        -H "Content-Type: application/json" \
        -d "{\"order\": ${test_order}, \"review\": \"${test_review}\", \"title\": \"${test_title}\"}")

    if [ "$http_status" != "204" ]; then
        log_error "Expected HTTP 204, got ${http_status}"
        return 1
    fi
    log_info "Received HTTP 204 No Content (expected)"

    # Verify message appears in Kafka
    log_info "Verifying message in Kafka topic '${KAFKA_TOPIC}'..."
    local start_time=$(date +%s)
    local message_found=false

    while true; do
        # Consume messages from the beginning of the topic
        local messages
        messages=$(docker exec "${KAFKA_CONTAINER}" \
            kafka-console-consumer \
            --bootstrap-server localhost:9092 \
            --topic "${KAFKA_TOPIC}" \
            --from-beginning \
            --timeout-ms 5000 2>/dev/null || true)

        if echo "$messages" | grep -q "${test_title}"; then
            message_found=true
            break
        fi

        local elapsed=$(($(date +%s) - start_time))
        if [ $elapsed -ge $TIMEOUT_SECONDS ]; then
            break
        fi
        sleep 2
    done

    if [ "$message_found" = true ]; then
        log_info "Message found in Kafka topic"
        return 0
    else
        log_error "Message not found in Kafka topic within ${TIMEOUT_SECONDS}s"
        return 1
    fi
}

# Main execution
main() {
    log_info "Starting E2E tests for process-queue-spring-camel-kafka"
    echo "=================================================="

    # Cleanup any previous runs
    cleanup

    # Build and start
    build_app
    start_services

    # Wait for app to be healthy
    wait_for_service "${APP_URL}/actuator/health" 60

    # Run tests
    local tests_passed=0
    local tests_failed=0

    if test_enqueue_message; then
        ((tests_passed++))
    else
        ((tests_failed++))
    fi

    # Summary
    echo "=================================================="
    log_info "Test Summary: ${tests_passed} passed, ${tests_failed} failed"

    if [ $tests_failed -gt 0 ]; then
        log_error "Some tests failed"
        exit 1
    fi

    log_info "All tests passed!"
    exit 0
}

main "$@"
