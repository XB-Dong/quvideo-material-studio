FROM maven:3.9.11-eclipse-temurin-21@sha256:6fdc855a6ed81d288ca7ca37ac6ff5e9308b612485c0801d70b25a858c83d237 AS source
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
FROM source AS test
CMD ["mvn", "-B", "verify"]
FROM source AS build
RUN mvn -B -DskipTests package
FROM eclipse-temurin:21-jre-jammy@sha256:9603446cf51296842eab342514857cf7ab55a8891cd564e6c68ec237fae65a16 AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/* && groupadd -g 10001 studio && useradd -u 10001 -g studio studio && mkdir -p /data/materials && chown studio:studio /data/materials
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
USER studio
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
