# Constitution

This document establishes the foundational governance principles for the Bond project. All specifications, plans, and implementations must adhere to these non-negotiable standards.

## Purpose

This project is a playground for testing various components of a web application. The core requirement is to process updates to reviews, decorate them with metadata, and render this to the user.

## Architecture Principles

### Service Independence
- Maintain minimum dependencies between services
- Services must be independently deployable and replaceable
- Abstract underlying technologies behind APIs so new implementations can be tested without affecting consumers

### API Standards
- All APIs must be RESTful
- JSON is the only supported interchange format
- Each service exposes a single, well-defined responsibility

### Port Allocation
- Bond Movie API: 3001-3003 range
- Metadata API: 3004, 3008
- Process Queue API: 3005-3006, 3009-3010 range
- UI: 3007
- Infrastructure: DynamoDB (8000), PostgreSQL (5432), Redis (6375), Kafka (9092), Zookeeper (2181)

## Infrastructure Patterns

### Shared Infrastructure
- DynamoDB instances are shared across Java and Node.js Bond Movie API implementations
- Kafka and Zookeeper are shared across all queue implementations
- This enables direct comparison of different technology implementations

### Environment Configuration
- All service interconnection is configured via environment variables. The same API is designed to be interchanged on a particular port. The implementation and technology should be completely interchangeable underneath this API. The core APIs are listed below
    - Bond Movies API - Main UI interface for retrieving movie data
    - Movie Metadata - Interface for retrieving movie metadata
    - Process Queue - Read, enrich, and persist movie reviews
    - Watch Reviews - Pick up reviews written by authors and enqueue them to the system
- It is possible to easily swap out one implementation of a REST interface for another
- `BOND_ENV` controls operating environment (`local` or `docker`)
- Changing API URLs in `.env` reconfigures dependent services for testing alternative implementations

### Containerisation
- Docker is the primary deployment mechanism for local development
- Services must support both local and Docker environments

## Technology Stack

### Supported Runtimes
- Node.js for rapid prototyping and primary implementations
- Java with Spring Boot for enterprise patterns and Hibernate ORM

### Data Stores
- DynamoDB for NoSQL document storage
- PostgreSQL for relational data
- Redis for caching
- Kafka with Zookeeper for message queuing

## Development Philosophy

### Experimentation First
- This is a playground - unit tests are not required
- Prioritise learning and experimentation over production readiness
- New technologies should be easy to introduce and compare

### End-to-End Testing
- E2E tests validate API contracts across all implementations
- Tests are implementation-agnostic - same tests run against Node.js and Spring
- Bruno is used for API testing (Git-friendly, no vendor lock-in)
- Tests live in `e2e-tests/` directory

### Implementation Swapping
- Multiple implementations of the same service type are encouraged
- Implementations are swapped using Docker Compose profiles configured in `.env`
- This enables A/B comparison of technologies and approaches

## Docker Compose Profiles

Each service has a profile. Configure `COMPOSE_PROFILES` in `.env` to choose which implementations run. Infrastructure starts automatically via `depends_on`.

### Usage

```sh
# Start the system
docker compose up

# Stop
docker compose down
```

### Switching Implementations

Edit `COMPOSE_PROFILES` in `.env`:

```sh
COMPOSE_PROFILES=bond-nodejs,metadata-nodejs,queue-kafkajs,ui,watch
```

Also update the corresponding API URLs for dependent services:

```sh
BOND_MOVIES_API_URL=http://bond-movies-api-nodejs:3001
MOVIE_METADATA_API_URL=http://movie-metadata-api-nodejs:3004
REVIEW_UPDATES_API_URL=http://review-updates-api-nodejs-kafkajs-kafka:3006
```

### Available Profiles

| API | Profile | Description |
|-----|---------|-------------|
| Bond Movies | `bond-nodejs` | Node.js + DynamoDB (port 3001) |
| | `bond-spring-dynamodb` | Spring + DynamoDB (port 3002) |
| | `bond-spring-postgresql` | Spring + PostgreSQL (port 3003) |
| Metadata | `metadata-nodejs` | Node.js + Redis (port 3004) |
| | `metadata-spring` | Spring + Redis (port 3008) |
| Process Queue | `queue-kafka-node` | Node.js + kafka-node (port 3005) |
| | `queue-kafkajs` | Node.js + kafkajs (port 3006) |
| | `queue-redis` | Node.js + Redis (port 3009) |
| | `queue-spring-camel` | Spring + Camel + Kafka (port 3010) |
| UI | `ui` | Vanilla JS (port 3007) |
| Watch | `watch` | File watcher service |
| Tools | `pgadmin` | PostgreSQL admin UI (port 5050) |

### Benefits

- Simple command: just `docker compose up`
- All configuration in one place (`.env`)
- Infrastructure starts automatically via `depends_on`
- Native Docker Compose feature via COMPOSE_PROFILES

## Component Responsibilities

### Bond Movie API
- Stores and retrieves Bond movie data
- Focus: testing web frameworks and database implementations

### Metadata API
- Caches metadata from external APIs (TMDB, OMDB)
- Focus: testing cache infrastructure and caching libraries

### Review Updates API
- Processes updated Bond movie reviews via message queue
- Focus: testing queue implementations (kafka-node, kafkajs)

### Watch Reviews
- File watcher for markdown review files
- Converts markdown to HTML

### UI
- End-user interface for consuming the RESTful API. Two implementations
    - Vanilla JavaScript implementation
    - React implementation

## E2E Testing

End-to-end API tests ensure all implementations conform to the same API contract.

### Technology

- **Bruno** - Open-source API client with Git-friendly `.bru` files
- Tests stored in `e2e-tests/` directory
- Environment files for each implementation (nodejs, spring-dynamodb, spring-postgresql)

### Structure

```
e2e-tests/
  package.json              # Bruno CLI dependency
  bond-movies-api/          # Bond Movies API tests
    bruno.json              # Collection config
    environments/           # Environment configs per implementation
    put-movie/              # PUT endpoint tests
```

### Running Tests

```sh
cd e2e-tests
npm install
npm run test:bond-movies:nodejs          # Test Node.js implementation
npm run test:bond-movies:spring-dynamodb # Test Spring DynamoDB implementation
```

### Adding Tests for New APIs

1. Create collection folder under `e2e-tests/`
2. Add `bruno.json` collection config
3. Add environment files for each implementation
4. Create test `.bru` files with assertions
5. Add npm scripts to `package.json`
