# backend/Dockerfile
# ---------- BUILD STAGE ----------
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /workspace/app

# cache dependencies faster
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN mvn -B -f pom.xml -DskipTests dependency:go-offline

# copy source and build
COPY src ./src
RUN mvn -B -DskipTests package

# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:17-jdk
# create non-root user
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

WORKDIR /app
# copy jar from builder
COPY --from=builder /workspace/app/target/*.jar app.jar

# optional: allow configuring JVM options via env
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
