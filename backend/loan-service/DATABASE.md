# Database Setup Guide

This document describes the database integration using Entity Framework Core.

## Database Provider

The application uses **SQLite** by default, which is perfect for development and can be easily switched to SQL Server, PostgreSQL, or other providers for production.

## Database Location

The SQLite database file (`loans.db`) is created automatically in the project root directory when the application first runs.

## Entity Models

### LoanProductEntity
Stores loan product information:
- Product ID, name, type (secured/unsecured)
- Amount ranges (min/max)
- Term ranges (min/max months)
- Base interest rate
- Active status flag
- Created/updated timestamps

### EligibilityCheckEntity
Stores eligibility check history:
- Personal details (age, employment status, years in role)
- Financial details (income, expenses, existing loans, credit score)
- Loan details (amount, term, purpose)
- Eligibility results (eligible flag, risk category, max amount)
- Recommended product reference
- Created timestamp

### RateCalculationEntity
Stores rate calculation history:
- Product reference
- Loan amount and term
- Credit score used
- Calculated rates and payments
- Created timestamp

## Database Initialization

The database is automatically created and seeded on application startup:

1. **Database Creation**: `EnsureCreated()` creates tables if they don't exist
2. **Seed Data**: Initial loan products are inserted if the database is empty

## Seeding Data

The `DatabaseSeeder` class seeds initial loan products:
- Personal Loan Standard
- Personal Loan Premium
- Auto Loan
- Home Loan
- Business Loan

To re-seed the database, delete `loans.db` and restart the application.

## Switching Database Providers

### SQL Server

1. Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=LoanEligibility;Trusted_Connection=True;"
  }
}
```

2. Update `Program.cs`:
```csharp
builder.Services.AddDbContext<LoanEligibilityDbContext>(options =>
    options.UseSqlServer(connectionString));
```

3. Add NuGet package:
```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

### PostgreSQL

1. Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=LoanEligibility;Username=postgres;Password=yourpassword"
  }
}
```

2. Update `Program.cs`:
```csharp
builder.Services.AddDbContext<LoanEligibilityDbContext>(options =>
    options.UseNpgsql(connectionString));
```

3. Add NuGet package:
```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

## Migrations (Optional)

For production environments, use EF Core migrations instead of `EnsureCreated()`:

### Create Migration
```bash
dotnet ef migrations add InitialCreate
```

### Apply Migration
```bash
dotnet ef database update
```

### Update Program.cs
Replace:
```csharp
context.Database.EnsureCreated();
```

With:
```csharp
context.Database.Migrate();
```

## Database Schema

### LoanProducts Table
```
- Id (PK, string, max 50)
- Name (string, max 200)
- Type (string, max 50)
- MinAmount (decimal 18,2)
- MaxAmount (decimal 18,2)
- MinTermMonths (int)
- MaxTermMonths (int)
- BaseRate (decimal 5,2)
- Description (string, max 500)
- IsActive (bool)
- CreatedAt (datetime)
- UpdatedAt (datetime, nullable)
```

### EligibilityChecks Table
```
- Id (PK, int, auto-increment)
- Age (int)
- EmploymentStatus (string, max 50)
- YearsInCurrentRole (int, nullable)
- AnnualIncome (decimal 18,2)
- MonthlyExpenses (decimal 18,2)
- ExistingLoans (decimal 18,2)
- CreditScore (int)
- RequestedAmount (decimal 18,2)
- RequestedTermMonths (int)
- Purpose (string, max 50)
- Eligible (bool)
- RiskCategory (string, max 50)
- MaxLoanAmount (decimal 18,2)
- RecommendedProductId (string, max 500, nullable, FK)
- RecommendedInterestRate (decimal 18,2, nullable)
- CreatedAt (datetime)
```

### RateCalculations Table
```
- Id (PK, int, auto-increment)
- ProductId (string, max 50, FK)
- Amount (decimal 18,2)
- TermMonths (int)
- CreditScore (int)
- CalculatedInterestRate (decimal 5,2)
- MonthlyPayment (decimal 18,2)
- TotalPayment (decimal 18,2)
- TotalInterest (decimal 18,2)
- CreatedAt (datetime)
```

## Indexes

The following indexes are automatically created:
- `LoanProducts.Id` (unique)
- `LoanProducts.Type`
- `LoanProducts.IsActive`
- `EligibilityChecks.CreatedAt`
- `EligibilityChecks.Eligible`
- `EligibilityChecks.CreditScore`
- `RateCalculations.ProductId`
- `RateCalculations.CreatedAt`

## Backing Up Data

### SQLite
Simply copy the `loans.db` file to a backup location.

### SQL Server
```sql
BACKUP DATABASE LoanEligibility TO DISK = 'C:\Backup\LoanEligibility.bak'
```

## Troubleshooting

### Database Locked Error
If you get a "database is locked" error:
1. Ensure no other processes are accessing the database
2. Close any database browser tools
3. Restart the application

### Reset Database
Delete `loans.db` and restart the application to create a fresh database with seed data.

### View Database Contents
Use a SQLite browser tool like:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- SQLiteStudio (https://sqlitestudio.pl/)

## Performance Considerations

- Indexes are in place for commonly queried fields
- Use async/await for all database operations
- Consider connection pooling for high-traffic scenarios
- For production, use a proper database server (SQL Server, PostgreSQL)

