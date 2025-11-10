FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5003

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["LoanEligibility.API.csproj", "."]
RUN dotnet restore "LoanEligibility.API.csproj"
COPY . .
RUN dotnet build "LoanEligibility.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LoanEligibility.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LoanEligibility.API.dll"]

