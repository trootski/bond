# Bond Movie API

#Build command with profile:
#mvn clean install -Dspring.profiles.active=local

#Command to install.

```shell script
mvn clean install -Dmaven.test.skip=true
```

#RUN:

```shell script
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=3003 -Dspring.profiles.active=local"
```

# RUN in DOCKER:

```shell
mvn clean package -Dmaven.test.skip=true
docker-compose -f ../docker-compose.yml --env-file=../.env up bond-movies-api-spring-postgresql
```

#UNIT TEST

```shell script
mvn test-compile surefire:test@unit -Plocal
```

#DEBUG:

```shell script
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -Dserver.port=3003 -Dspring.profiles.active=local"
```

#PACKAGE

```shell script
mvn clean package -Dmaven.test.skip=true
```

#Liquibase Drop All

**Careful Now**

```shell script
mvn liquibase:dropAll -Plocal
```

#Liquibase Sync Changesets

```shell script
mvn resources:resources liquibase:update -Plocal
```

#Liquibase Diff Hibernate and Local DB

```shell script
mvn clean compile -Dmaven.test.skip=true resources:resources liquibase:diff -Plocal
```

# Watch The Local database

```shell script
watch -n 1 'psql -c "SELECT * FROM bond_movies;" -h localhost -U bond_movies -p 5432 -d bond_movies;'
```

# Swagger Page

http://localhost:3003/swagger-ui/index.html?url=/v3/api-docs&validatorUrl=

