using Microsoft.EntityFrameworkCore;
using LoanEligibility.API.Data.Entities;

namespace LoanEligibility.API.Data;

public class LoanEligibilityDbContext : DbContext
{
    public LoanEligibilityDbContext(DbContextOptions<LoanEligibilityDbContext> options)
        : base(options)
    {
    }

    public DbSet<LoanProductEntity> LoanProducts { get; set; }
    public DbSet<EligibilityCheckEntity> EligibilityChecks { get; set; }
    public DbSet<RateCalculationEntity> RateCalculations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure LoanProductEntity
        modelBuilder.Entity<LoanProductEntity>(entity =>
        {
            entity.HasIndex(e => e.Id).IsUnique();
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.IsActive);
        });

        // Configure EligibilityCheckEntity
        modelBuilder.Entity<EligibilityCheckEntity>(entity =>
        {
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.Eligible);
            entity.HasIndex(e => e.CreditScore);
            
            entity.HasOne(e => e.RecommendedProduct)
                  .WithMany()
                  .HasForeignKey(e => e.RecommendedProductId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure RateCalculationEntity
        modelBuilder.Entity<RateCalculationEntity>(entity =>
        {
            entity.HasIndex(e => e.ProductId);
            entity.HasIndex(e => e.CreatedAt);
            
            entity.HasOne(e => e.Product)
                  .WithMany()
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

