# Bond Movie API

#Build command with profile:
#mvn clean install -Dspring.profiles.active=local

#Command to install.
mvn clean install -Dmaven.test.skip=true

#RUN:
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8080 -Dspring.profiles.active=local"

#UNIT TEST
mvn test-compile surefire:test@unit -Plocal

#DEBUG:
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -Dserver.port=8080 -Dspring.profiles.active=local"

#PACKAGE
mvn clean package -Dmaven.test.skip=true

#Liquibase Sync Changesets
mvn liquibase:dropAll -Plocal

#Liquibase Sync Changesets
mvn resources:resources liquibase:update -Plocal

#Liquibase Diff Hibernate and Local DB

mvn liquibase:diff -DdiffChangeLogFile=src/main/resources/liquibase.changelog-master.xml


