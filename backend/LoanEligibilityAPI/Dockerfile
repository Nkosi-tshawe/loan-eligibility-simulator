# Use the official .NET 8 runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

EXPOSE 5203
# EXPOSE 5003

# Use the official .NET 8 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Production
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["LoanEligibilityAPI.csproj", "./"]
RUN dotnet restore "LoanEligibilityAPI.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "LoanEligibilityAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Production
RUN dotnet publish "LoanEligibilityAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Create the final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Install PostgreSQL client for database migrations
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["dotnet", "LoanEligibilityAPI.dll"]