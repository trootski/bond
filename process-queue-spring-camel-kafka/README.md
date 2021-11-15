## Run locally

The following command can be used to run the service locally. Note that this is required to run inside the docker container in order to connect as expected to kafka.

```shell
docker-compose stop review-updates-api-spring-camel-kafka && mvn package spring-boot:repackage  && docker-compose  --env-file=../.env up --build review-updates-api-spring-camel-kafka
```
