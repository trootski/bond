# Build stage
FROM maven:3.9-amazoncorretto-19 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests -B

# Runtime stage
FROM amazoncorretto:19
WORKDIR /opt/app
COPY --from=build /app/target/*.jar /opt/app/app.jar
EXPOSE 3002
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/app.jar" ]
