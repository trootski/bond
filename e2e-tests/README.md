# Bond E2E Tests

End-to-end API tests for Bond services using [Bruno](https://www.usebruno.com/).

## Setup

```bash
cd e2e-tests
npm install
```

## Running Tests

### Prerequisites

Ensure the service you want to test is running:

```bash
# From project root
docker compose up
```

### Run Tests

**Bond Movies API:**
```bash
npm run test:bond-movies:nodejs           # Node.js (port 3001)
npm run test:bond-movies:spring-dynamodb  # Spring + DynamoDB (port 3002)
npm run test:bond-movies:spring-postgresql # Spring + PostgreSQL (port 3003)
```

**Movie Metadata API:**
```bash
npm run test:metadata:nodejs   # Node.js (port 3004)
npm run test:metadata:spring   # Spring (port 3008)
```

**Process Queue API:**
```bash
npm run test:process-queue:kafkajs  # KafkaJS (port 3006)
```

**All Tests:**
```bash
npm run test:all:nodejs        # Run all Node.js implementation tests
npm run test:all               # Run all tests across all implementations
```

### Run with Bruno CLI directly

```bash
# Run all tests in a collection with specific environment
npx bru run bond-movies-api --env nodejs
npx bru run movie-metadata-api --env nodejs
npx bru run process-queue-api --env kafkajs

# Run specific folder
npx bru run bond-movies-api/put-movie --env nodejs
```

## Structure

```
e2e-tests/
  bond-movies-api/
    bruno.json              # Collection config
    environments/
      nodejs.bru            # Node.js impl (port 3001)
      spring-dynamodb.bru   # Spring DynamoDB (port 3002)
      spring-postgresql.bru # Spring PostgreSQL (port 3003)
    put-movie/
      1-put-new-movie.bru       # Create movie
      2-verify-movie-created.bru # Verify creation
      3-put-update-movie.bru    # Update movie
      4-verify-movie-updated.bru # Verify update
  movie-metadata-api/
    bruno.json              # Collection config
    environments/
      nodejs.bru            # Node.js impl (port 3004)
      spring.bru            # Spring impl (port 3008)
    get-movie/
      1-get-movie-metadata.bru  # Get movie metadata
      2-get-cached-movie.bru    # Verify caching works
      3-get-different-movie.bru # Get another movie
  process-queue-api/
    bruno.json              # Collection config
    environments/
      kafkajs.bru           # KafkaJS impl (port 3006)
    enqueue-review/
      1-enqueue-review-update.bru  # Enqueue a review update
      2-enqueue-another-review.bru # Enqueue second review
      3-enqueue-minimal-review.bru # Enqueue minimal review
```

## Services Not Covered

**watch-reviews**: This is a file watcher service, not an HTTP API. It monitors markdown files in `storage/reviews/` and automatically POSTs updates to the process-queue-api when files change.

## Adding New Tests

1. Create a `.bru` file in the appropriate folder
2. Use `{{baseUrl}}` for the API base URL
3. Add assertions and tests
4. Tests run in sequence based on `seq` number in meta

## Opening in Bruno GUI

1. Download Bruno from https://www.usebruno.com/
2. Open Bruno and select "Open Collection"
3. Navigate to `e2e-tests/bond-movies-api`
4. Select environment from dropdown
