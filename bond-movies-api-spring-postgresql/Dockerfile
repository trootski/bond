# Build stage
FROM maven:3.9-amazoncorretto-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# Runtime stage
FROM amazoncorretto:21
WORKDIR /opt/app
COPY --from=build /app/target/app.jar /opt/app
EXPOSE 3003
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/app.jar"]
