FROM java:8
WORKDIR /opt/app
COPY target/bond-movies-api-spring-postgresql-0.0.1-SNAPSHOT.jar /opt/app
EXPOSE 3003
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/bond-movies-api-spring-postgresql-0.0.1-SNAPSHOT.jar" ]
