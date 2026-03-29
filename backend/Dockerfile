# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose Render port
EXPOSE 8080

# Run Spring Boot
CMD ["java", "-jar", "target/*.jar"]