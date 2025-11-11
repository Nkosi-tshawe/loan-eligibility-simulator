# Loan Eligibility Simulator
A single-page web application where customers enter monthly income, expenses, desired loan amount, and optional loan term to see estimated eligibility (DTI, eligible amount, recommended term, Eligible/Not Eligible)

# Loan Eligibility Simulator - Setup Guide

This guide will help you set up and run the Loan Eligibility Simulator project locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
  - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
  - [Option 2: Manual Setup](#option-2-manual-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v20 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **.NET SDK** (8.0 or higher)
  - Download from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
  - Verify installation: `dotnet --version`

- **Docker Desktop** (Optional, but recommended)
  - Download from [docker.com](https://www.docker.com/products/docker-desktop)
  - Verify installation: `docker --version` and `docker-compose --version`

- **PostgreSQL** (v15 or higher) - Only needed if running without Docker
  - Download from [postgresql.org](https://www.postgresql.org/download/)

### Recommended Tools

- **Git** - For version control
- **VS Code** or **Visual Studio** - For development
- **Postman** or **Thunder Client** - For API testing

## Project Structure

```
loan-eligibility-simulator/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── services/             # API service clients
│   └── package.json
│
├── backend/
│   ├── loan-service/         # Loan eligibility API (ASP.NET Core)
│   │   ├── Controllers/      # API controllers
│   │   ├── Services/         # Business logic services
│   │   ├── Data/             # Database context and entities
│   │   └── Models/           # Data models
│   │
│   └── auth-service/         # Authentication API (ASP.NET Core)
│       ├── Controllers/      # Auth endpoints
│       ├── Services/          # Auth business logic
│       └── Data/             # Database context
│
├── docker-compose.yml        # Production Docker setup
├── docker-compose.dev.yml    # Development Docker setup
└── nginx/                    # Nginx configuration (optional)
```

## Local Development Setup

### Option 1: Docker Compose (Recommended)

This is the easiest way to get everything running with a single command.

#### Step 1: Create Environment File

Create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=loaneligibility

# API Configuration
ASPNETCORE_ENVIRONMENT=Development
NODE_ENV=development
```

#### Step 2: Start All Services

For **development**:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

For **production**:
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port `5432`
- Backend API services
- Frontend Next.js application on port `3000`

#### Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Loan Service API**: http://localhost:5203
- **Auth Service API**: http://localhost:5002 (if configured)

### Option 2: Manual Setup

If you prefer to run services individually without Docker:

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, for environment variables):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5203
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

#### Backend Setup - Loan Service

1. Navigate to the loan service directory:
```bash
cd backend/loan-service
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update `appsettings.json` or `appsettings.Development.json` with your database connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=loaneligibility;Username=postgres;Password=your_password"
  }
}
```

4. Run database migrations (if using EF Core):
```bash
dotnet ef database update
```

5. Run the API:
```bash
dotnet run
```

The API will be available at http://localhost:5203

#### Backend Setup - Auth Service

1. Navigate to the auth service directory:
```bash
cd backend/auth-service
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update `appsettings.json` with your database connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=authdb;Username=postgres;Password=your_password"
  }
}
```

4. Run database migrations:
```bash
dotnet ef database update
```

5. Run the API:
```bash
dotnet run
```

The API will be available at http://localhost:5002

#### Database Setup (PostgreSQL)

1. Install PostgreSQL if not already installed

2. Create databases:
```sql
CREATE DATABASE loaneligibility;
CREATE DATABASE authdb;
```

3. Ensure PostgreSQL is running and accessible on `localhost:5432`

## Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5203
NEXT_PUBLIC_AUTH_URL=http://localhost:5002
```

### Backend (appsettings.Development.json)

Update the following sections in your `appsettings.Development.json` files:

**Loan Service:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=loaneligibility;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForProduction!",
    "Issuer": "LoanEligibilitySystem",
    "Audience": "LoanEligibilityClient"
  }
}
```

**Auth Service:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=authdb;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLongForProduction!",
    "Issuer": "LoanEligibilitySystem",
    "Audience": "LoanEligibilityClient"
  }
}
```

## Running the Application

### Development Mode

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend Services:**
```bash
# Terminal 1 - Loan Service
cd backend/loan-service
dotnet watch run

# Terminal 2 - Auth Service
cd backend/auth-service
dotnet watch run
```

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend/loan-service
dotnet publish -c Release
dotnet run --project bin/Release/net8.0/LoanEligibility.API.dll
```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend

- `dotnet restore` - Restore NuGet packages
- `dotnet build` - Build the project
- `dotnet run` - Run the application
- `dotnet watch run` - Run with hot reload
- `dotnet ef database update` - Apply database migrations

## Troubleshooting

### Port Already in Use

If you get port conflicts:

1. **Port 3000 (Frontend)**: Change in `frontend/package.json` scripts or use `PORT=3001 npm run dev`
2. **Port 5203 (Loan Service)**: Update in `backend/loan-service/Program.cs` or `appsettings.json`
3. **Port 5002 (Auth Service)**: Update in `backend/auth-service/Program.cs` or `appsettings.json`
4. **Port 5432 (PostgreSQL)**: Stop existing PostgreSQL service or change port in docker-compose.yml

### Database Connection Issues

1. **Check PostgreSQL is running:**
```bash
# Docker
docker ps | grep postgres

# Local
pg_isready
```

2. **Verify connection string** matches your database credentials

3. **Check firewall settings** if connecting remotely

### Docker Issues

1. **Clean up Docker resources:**
```bash
docker-compose down -v
docker system prune -a
```

2. **Rebuild containers:**
```bash
docker-compose build --no-cache
```

3. **Check logs:**
```bash
docker-compose logs -f [service-name]
```

### Frontend Build Errors

1. **Clear Next.js cache:**
```bash
rm -rf .next
npm run build
```

2. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend Build Errors

1. **Clear NuGet cache:**
```bash
dotnet nuget locals all --clear
dotnet restore
```

2. **Clean and rebuild:**
```bash
dotnet clean
dotnet build
```

## Next Steps

After setup:

1. **Explore the Application:**
   - Navigate to http://localhost:3000
   - Complete the eligibility form flow
   - View eligibility results

2. **API Documentation:**
   - Check `/swagger` endpoint (if enabled) for API documentation
   - Use Postman/Thunder Client to test API endpoints

3. **Development:**
   - Make changes to frontend components in `frontend/components/`
   - Update backend services in `backend/*/Services/`
   - Database models in `backend/*/Data/Entities/`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

## Support

If you encounter issues not covered in this guide:

1. Check existing issues in the repository
2. Review application logs
3. Ensure all prerequisites are correctly installed
4. Verify environment variables are set correctly


