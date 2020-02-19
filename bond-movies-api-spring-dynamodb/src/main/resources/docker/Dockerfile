FROM java:8
WORKDIR /
ADD target/BondSpring-0.0.1-SNAPSHOT.jar //
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "-Dspring.profiles.active=docker", "BondSpring-0.0.1-SNAPSHOT.jar" ]
