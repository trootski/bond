# Bond Movie API

#Build command with profile:
#mvn clean install -Dspring.profiles.active=local

#Command to install.

```shell script
mvn clean install -Dmaven.test.skip=true
```

#RUN:

```shell script
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8080 -Dspring.profiles.active=local"
```

#UNIT TEST

```shell script
mvn test-compile surefire:test@unit -Plocal
```

#DEBUG:

```shell script
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -Dserver.port=8080 -Dspring.profiles.active=local"
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
mvn liquibase:diff -DdiffChangeLogFile=src/main/resources/liquibase.changelog-master.sql
```

# Watch The Local database

```shell script
watch -n 1 'psql -c "SELECT * FROM bond_movies;" -h localhost -U bond_movies -p 5432 -d bond_movies;'
```

# Swagger Page

http://localhost:8080/swagger-ui/index.html?url=/v3/api-docs&validatorUrl=

