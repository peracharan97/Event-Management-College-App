# ---- Build Stage ----
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# ✅ give permission to mvnw
RUN chmod +x mvnw

# build jar
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

ENTRYPOINT ["java","-jar","target/QREventManager-0.0.1-SNAPSHOT.jar"]