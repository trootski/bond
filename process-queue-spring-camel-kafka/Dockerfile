FROM maven:3.9-amazoncorretto-17 AS build
WORKDIR /build
COPY pom.xml .
COPY process-queue-spring-camel-kafka/pom.xml ./process-queue-spring-camel-kafka/
COPY process-queue-spring-camel-kafka/src ./process-queue-spring-camel-kafka/src
RUN mvn -f process-queue-spring-camel-kafka/pom.xml package -DskipTests -q

FROM amazoncorretto:17
WORKDIR /opt/app
COPY --from=build /build/process-queue-spring-camel-kafka/target/app.jar /opt/app/app.jar
EXPOSE 3010
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/app.jar"]
