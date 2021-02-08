FROM java:8
WORKDIR /opt/app
COPY target/movie-metadata-api-spring-0.0.1-SNAPSHOT.jar /opt/app
EXPOSE 3008
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/movie-metadata-api-spring-0.0.1-SNAPSHOT.jar" ]
