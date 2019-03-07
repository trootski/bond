#!/bin/bash

set -x

docker stop $(docker ps -q --filter ancestor=spotify/kafka )

docker run -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=`docker-machine ip \`docker-machine active\`` --env ADVERTISED_PORT=9092 -d spotify/kafka

sleep 10

export KAFKA=`docker-machine ip \`docker-machine active\``:9092
export ZOOKEEPER=`docker-machine ip \`docker-machine active\``:2181

~/Downloads/kafka_2.11-2.1.0/bin/kafka-topics.sh \
  --create \
  --zookeeper "$ZOOKEEPER" \
  --replication-factor 1 \
  --partitions 1 \
  --topic test

~/Downloads/kafka_2.11-2.1.0/bin/kafka-console-producer.sh \
  --broker-list "$KAFKA" \
  --topic test
# ~/Downloads/kafka_2.11-2.1.0/bin/kafka-topics.sh --list --zookeeper localhost:2181

