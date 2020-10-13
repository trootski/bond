# Bond Movie API

#Build command with profile:
#mvn clean install -Dspring.profiles.active=local
mvn test-compile surefire:test@unit -Dtest.env=local

#Command to install.
mvn clean install -Dmaven.test.skip=true

#RUN:
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8080 -Dspring.profiles.active=local"

#DEBUG:
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -Dserver.port=8080 -Dspring.profiles.active=local"

#Liquibase execution
mvn resources:resources liquibase:update -Plocal

#E2e service
mvn test-compile surefire:test@service -Dtest.env=local // to run the services test

#Pact
mvn test-compile surefire:test@pact -Dtest.env=local
