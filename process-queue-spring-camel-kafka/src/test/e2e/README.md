# End-to-End Tests

This directory contains end-to-end tests that verify the external REST contract of the service by running it in a Docker environment and testing over the network.

## Prerequisites

- Docker and Docker Compose
- Maven
- curl
- Bash

## Running the Tests

From the project root directory:

```bash
./src/test/e2e/run-tests.sh
```

Or from this directory:

```bash
./run-tests.sh
```

The script will:
1. Build the application JAR
2. Start Docker containers (Zookeeper, Kafka, and the application)
3. Wait for services to be healthy
4. Send a POST request to the enqueue endpoint
5. Verify the message appears in the Kafka topic
6. Clean up all containers

## Test Details

### Test: Enqueue Message

- **Endpoint**: `POST /v1/bond-movie-events/review-updates/enqueue`
- **Expected Response**: HTTP 204 No Content
- **Verification**: Message appears in `BondMoviesToBeProcessed` Kafka topic within 30 seconds

## Configuration

Edit `run-tests.sh` to modify:

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_TOPIC` | `BondMoviesToBeProcessed` | Kafka topic to verify |
| `APP_URL` | `http://localhost:3010` | Application base URL |
| `TIMEOUT_SECONDS` | `30` | Max wait time for Kafka message |

## Troubleshooting

View container logs:
```bash
docker compose -f src/test/e2e/docker-compose.yaml logs -f
```

Manual cleanup:
```bash
docker compose -f src/test/e2e/docker-compose.yaml down -v --remove-orphans
```

---

## Alternative Tools and Frameworks

For more sophisticated E2E testing, consider these alternatives:

### 1. **Testcontainers** (Recommended for Java projects)
Run containers from JUnit tests with full programmatic control.

```java
@Testcontainers
class KafkaIntegrationTest {
    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

    @Test
    void testEnqueueMessage() {
        // Test with real Kafka
    }
}
```

**Pros**: Native Java, integrates with existing test framework, automatic cleanup
**Cons**: Slower than mocks, requires Docker

### 2. **Hurl**
Declarative HTTP testing with simple syntax.

```hurl
POST http://localhost:3010/v1/bond-movie-events/review-updates/enqueue
Content-Type: application/json
{"order": 1, "review": "Great", "title": "Goldfinger"}

HTTP 204
```

Run: `hurl --test test.hurl`

**Pros**: Simple syntax, CI-friendly, built-in assertions
**Cons**: HTTP only (no Kafka verification without scripting)

### 3. **Karate**
BDD-style API testing with Kafka support.

```gherkin
Feature: Bond Movie Events

Scenario: Enqueue movie review
  Given url 'http://localhost:3010'
  And path '/v1/bond-movie-events/review-updates/enqueue'
  And request { order: 1, review: 'Great', title: 'Goldfinger' }
  When method post
  Then status 204
```

**Pros**: BDD syntax, Kafka consumer support, parallel execution
**Cons**: Learning curve, Groovy-based

### 4. **k6**
Load testing with functional test capabilities.

```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const res = http.post(
    'http://localhost:3010/v1/bond-movie-events/review-updates/enqueue',
    JSON.stringify({ order: 1, review: 'Great', title: 'Goldfinger' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(res, { 'status is 204': (r) => r.status === 204 });
}
```

**Pros**: Performance testing included, JavaScript, good reporting
**Cons**: Primarily for load testing

### 5. **BATS** (Bash Automated Testing System)
Structured bash testing framework.

```bash
@test "enqueue returns 204" {
  run curl -s -o /dev/null -w "%{http_code}" -X POST ...
  [ "$output" = "204" ]
}
```

**Pros**: Pure bash, TAP output, simple
**Cons**: Limited to what bash can do

### Recommendation

| Use Case | Recommended Tool |
|----------|-----------------|
| Quick validation | Current bash script or Hurl |
| Java project integration | Testcontainers |
| API contract testing | Karate or Hurl |
| Load + functional testing | k6 |
| CI pipeline | Hurl or bash script |
