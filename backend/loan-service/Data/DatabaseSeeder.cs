using Microsoft.EntityFrameworkCore;
using LoanEligibility.API.Data.Entities;

namespace LoanEligibility.API.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(LoanEligibilityDbContext context)
    {
        // Check if database is already seeded
        if (await context.LoanProducts.AnyAsync())
        {
            return;
        }

        var products = new List<LoanProductEntity>
        {
            new LoanProductEntity
            {
                Id = "personal-001",
                Name = "Personal Loan Standard",
                Type = "unsecured",
                MinAmount = 5000,
                MaxAmount = 50000,
                MinTermMonths = 12,
                MaxTermMonths = 60,
                BaseRate = 8.5m,
                Description = "Flexible personal loan for various purposes",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new LoanProductEntity
            {
                Id = "personal-002",
                Name = "Personal Loan Premium",
                Type = "unsecured",
                MinAmount = 50000,
                MaxAmount = 200000,
                MinTermMonths = 24,
                MaxTermMonths = 84,
                BaseRate = 7.5m,
                Description = "Premium personal loan with lower rates",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new LoanProductEntity
            {
                Id = "car-001",
                Name = "Auto Loan",
                Type = "secured",
                MinAmount = 10000,
                MaxAmount = 300000,
                MinTermMonths = 24,
                MaxTermMonths = 84,
                BaseRate = 5.5m,
                Description = "Secured auto loan with competitive rates",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new LoanProductEntity
            {
                Id = "home-001",
                Name = "Home Loan",
                Type = "secured",
                MinAmount = 50000,
                MaxAmount = 2000000,
                MinTermMonths = 120,
                MaxTermMonths = 360,
                BaseRate = 4.5m,
                Description = "Long-term home financing",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new LoanProductEntity
            {
                Id = "business-001",
                Name = "Business Loan",
                Type = "unsecured",
                MinAmount = 25000,
                MaxAmount = 500000,
                MinTermMonths = 12,
                MaxTermMonths = 120,
                BaseRate = 6.5m,
                Description = "Business financing solutions",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.LoanProducts.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }
}

