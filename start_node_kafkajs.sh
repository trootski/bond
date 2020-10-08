#!/usr/bin/env bash

docker-compose down

docker-compose up --build -d movie-metadata-api process-queue-kafkajs

sleep 5

docker-compose up --build -d bond-movies-api-nodejs

sleep 20

docker-compose up --build -d watch-reviews

sleep 5

docker-compose logs --follow process-queue-kafkajs movie-metadata-api watch-reviews bond-movies-api-nodejs

