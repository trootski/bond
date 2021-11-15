FROM java:8
WORKDIR /opt/app
COPY target/process-queue-spring-camel-kafka-1.0-SNAPSHOT.jar /opt/app
EXPOSE 3010
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/process-queue-spring-camel-kafka-1.0-SNAPSHOT.jar" ]
