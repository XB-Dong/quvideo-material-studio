FROM maven:3.9.11-eclipse-temurin-21 AS source
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
FROM source AS test
CMD ["mvn", "-B", "verify"]
FROM source AS build
RUN mvn -B -DskipTests package
FROM eclipse-temurin:21-jre-jammy AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/* && groupadd -g 10001 studio && useradd -u 10001 -g studio studio && mkdir -p /data/materials && chown studio:studio /data/materials
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
USER studio
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
