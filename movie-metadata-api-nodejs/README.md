# Movie Metadata API (Node.js)

Metadata API which caches movie metadata taken from external APIs. This service is part of the [Bond project](../README.md) and provides movie information to other services in the system.

## Overview

This service fetches movie metadata from external providers and caches results in Redis to reduce API calls and improve response times. It supports two metadata providers:

* [The Movie Database (TMDB)](https://www.themoviedb.org) - Default provider
* [The Open Movie Database (OMDB)](http://www.omdbapi.com)

**Stack:** Node.js + Koa + Redis

**Port:** 3004

## Architecture

```
┌─────────────┐     ┌─────────────────────┐     ┌─────────┐
│   Client    │────▶│  Movie Metadata API │────▶│  Redis  │
└─────────────┘     │     (Port 3004)     │     │ (6375)  │
                    └──────────┬──────────┘     └─────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
              ┌──────────┐          ┌──────────┐
              │   TMDB   │          │   OMDB   │
              │   API    │          │   API    │
              └──────────┘          └──────────┘
```

## Data Flow

1. Client requests movie metadata via `GET /api/v1/movies/:title`
2. Service checks Redis cache for existing data
3. On cache hit: return cached data immediately
4. On cache miss:
   - Fetch metadata from configured provider (TMDB or OMDB)
   - Normalize response to common format
   - Cache result in Redis with TTL
   - Return metadata to client

## Setup

### Prerequisites

* Docker and Docker Compose (for containerized setup)
* Node.js 12+ (for local development)
* API keys from [TMDB](https://www.themoviedb.org/settings/api) and/or [OMDB](http://www.omdbapi.com/apikey.aspx)

### Running with Docker Compose

From the parent directory (`bond/`):

```sh
# Start the service and Redis dependency
docker-compose -f docker-compose.yml --env-file=.env up -d movie-metadata-api-nodejs

# View logs
docker-compose logs -f movie-metadata-api-nodejs

# Stop the service
docker-compose stop movie-metadata-api-nodejs redis
```

Or use npm scripts from this directory:

```sh
npm run start:docker  # Build and start with logs
npm run clean         # Stop and remove Redis data
```

### Local Development

```sh
# Install dependencies
npm install

# Start with auto-reload
npm start
```

Requires Redis running on `localhost:6375`.

## API

### Get Movie Metadata

```
GET /api/v1/movies/:title
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| title | path | Movie title to search for |

**Example Request:**

```sh
curl http://localhost:3004/api/v1/movies/casino-royale
```

**Example Response:**

```json
{
  "imdb_id": "tt0381061",
  "poster": "http://image.tmdb.org/t/p/w185/...",
  "runtime": "144 mins",
  "synopsis": "Le Chiffre, a banker to the world's terrorists...",
  "title": "Casino Royale",
  "year": "2006",
  "type": "movie"
}
```

## Configuration

### Config Files

| File | Purpose |
|------|---------|
| `config/config.json` | Base configuration |
| `config/config-docker.json` | Docker overrides (Redis hostname) |

### Options

| Key | Default | Description |
|-----|---------|-------------|
| `app.cache_expiry_timeout` | 3000 | Cache TTL in milliseconds |
| `app.movie_meta_store` | tmdb | Metadata provider: `tmdb` or `omdb` |
| `omdb.key` | - | OMDB API key |
| `tmdb.key` | - | TMDB API key |
| `tmdb.base_url` | https://api.themoviedb.org/3 | TMDB API base URL |
| `tmdb.poster_base_url` | http://image.tmdb.org/t/p/w185 | TMDB poster image base URL |
| `redis.url` | localhost | Redis hostname |
| `redis.port` | 6375 | Redis port |

### Switching Metadata Providers

Edit `config/config.json`:

```json
{
  "app": {
    "movie_meta_store": "omdb"
  }
}
```

## Environment Variables

| Name | Default | Description |
|------|---------|-------------|
| BOND_ENV | local | Set to `docker` to load Docker config overrides |

## Response Format

Both OMDB and TMDB responses are normalized to a common format:

| Field | Description |
|-------|-------------|
| `imdb_id` | IMDB identifier |
| `poster` | URL to movie poster image |
| `runtime` | Movie duration (e.g., "144 mins") |
| `synopsis` | Plot summary |
| `title` | Movie title |
| `year` | Release year |
| `type` | Always "movie" |

## Troubleshooting

### Service won't start

* Ensure Redis is running: `docker-compose up -d redis`
* Check Redis connectivity: `docker exec -it bond-redis-1 redis-cli -p 6375 ping`

### API returns empty or error

* Verify API keys are set in `config/config.json`
* Check logs for API errors: `docker-compose logs movie-metadata-api-nodejs`
* TMDB requires the movie title to match closely; try exact titles

### Cache not working

* Verify Redis connection in logs (look for "Connected to Redis")
* Check cache TTL setting (`app.cache_expiry_timeout`)
* Inspect Redis directly: `docker exec -it bond-redis-1 redis-cli -p 6375 KEYS "*"`

### Connection refused errors

* In Docker: ensure `BOND_ENV=docker` is set so it uses hostname `redis` instead of `localhost`
* Locally: ensure Redis is running on port 6375
