FROM amazoncorretto:19
WORKDIR /opt/app
COPY target/app.jar /opt/app
EXPOSE 3008
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=docker", "/opt/app/app.jar" ]
