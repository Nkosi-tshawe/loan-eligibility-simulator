# Loan Eligibility API - .NET Core Backend

Production-grade .NET Core 8.0 Web API for the Loan Eligibility System.

## Architecture

The backend follows the **Model layer** of the MVP pattern:

- **Models**: Data transfer objects (DTOs) representing requests/responses
- **Services**: Business logic layer (eligibility, rate calculation, affordability)
- **Controllers**: ASP.NET Core API controllers handling HTTP requests

## Project Structure

```
backend-dotnet/
├── Controllers/
│   └── LoanController.cs       # API endpoints
├── Data/
│   ├── Entities/               # Entity Framework entities
│   │   ├── LoanProductEntity.cs
│   │   ├── EligibilityCheckEntity.cs
│   │   └── RateCalculationEntity.cs
│   ├── LoanEligibilityDbContext.cs  # DbContext
│   └── DatabaseSeeder.cs       # Seed data initialization
├── Models/
│   ├── EligibilityModels.cs    # Eligibility-related DTOs
│   ├── RateCalculationModels.cs # Rate calculation DTOs
│   └── ValidationRule.cs       # Validation rule DTOs
├── Services/
│   ├── LoanEligibilityService.cs   # Eligibility calculations
│   ├── LoanProductService.cs      # Product catalog (now DB-backed)
│   ├── RateCalculationService.cs   # Interest rate calculations
│   └── AffordabilityService.cs     # Affordability analysis
├── Program.cs                  # Application entry point & DI setup
└── LoanEligibility.API.csproj # Project file
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK or higher
- Visual Studio 2022, VS Code, or Rider (optional)

### Run the Application

```bash
cd backend-dotnet
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5001`

**Note**: On first run, the database (`loans.db`) will be automatically created and seeded with initial loan products.

### Build for Production

```bash
dotnet build -c Release
dotnet publish -c Release
```

### Run Tests

```bash
dotnet test
```

## API Endpoints

All endpoints are under `/api/loans`:

### POST `/api/loans/eligibility`

Check loan eligibility and get recommendations.

**Request Body**:
```json
{
  "personalDetails": {
    "age": 35,
    "employmentStatus": "employed",
    "yearsInCurrentRole": 3
  },
  "financialDetails": {
    "annualIncome": 80000,
    "monthlyExpenses": 2500,
    "existingLoans": 200,
    "creditScore": 750
  },
  "loanDetails": {
    "requestedAmount": 40000,
    "requestedTermMonths": 60,
    "purpose": "personal"
  }
}
```

**Response**: `EligibilityResponse`

### GET `/api/loans/products`

Get all available loan products.

**Response**: `{ "products": LoanProduct[] }`

### POST `/api/loans/calculate-rate`

Calculate interest rate and payment schedule.

**Request Body**: `CalculateRateRequest`

**Response**: `CalculateRateResponse`

### GET `/api/loans/validation-rules`

Get dynamic validation rules for form inputs.

**Response**: `ValidationRulesResponse`

## Database

The application uses **Entity Framework Core** with **SQLite** by default. The database is automatically created and seeded on first run.

- **Database File**: `loans.db` (created in project root)
- **Entity Models**: Loan Products, Eligibility Checks, Rate Calculations
- **Seed Data**: Initial loan products are automatically inserted

See [DATABASE.md](DATABASE.md) for detailed database documentation, including:
- Entity models and relationships
- Switching database providers (SQL Server, PostgreSQL)
- Migrations
- Backup and troubleshooting

## Dependency Injection

Services are registered in `Program.cs`:

- `LoanEligibilityDbContext`: Scoped (per request)
- `LoanProductService`: Scoped (uses DbContext)
- `LoanEligibilityService`: Scoped
- `RateCalculationService`: Scoped
- `AffordabilityService`: Scoped

## CORS Configuration

CORS is configured to allow all origins (for development). In production, configure specific origins.

## Swagger/OpenAPI

Swagger UI is available at `/swagger` when running in Development mode.

## Health Check

Health check endpoint: `GET /health`

## Database Schema

The application includes three main tables:

1. **LoanProducts**: Catalog of available loan products
2. **EligibilityChecks**: History of eligibility checks (for future analytics)
3. **RateCalculations**: History of rate calculations (for future analytics)

See [DATABASE.md](DATABASE.md) for complete schema documentation.

## Migration from Node.js

The .NET Core backend maintains **100% API compatibility** with the original Node.js/Express backend:

- Same endpoint paths
- Same request/response structures
- Same business logic
- Same validation rules

The frontend can switch between backends by changing the API base URL.

