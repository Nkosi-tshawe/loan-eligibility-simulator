using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoanEligibility.API.Data.Entities;

[Table("EligibilityChecks")]
public class EligibilityCheckEntity
{
    [Key]
    public int Id { get; set; }

    // Personal Details (stored as JSON or separate fields)
    public int Age { get; set; }

    [MaxLength(50)]
    public string EmploymentStatus { get; set; } = string.Empty;

    public int? YearsInCurrentRole { get; set; }

    // Financial Details
    [Column(TypeName = "decimal(18,2)")]
    public decimal AnnualIncome { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MonthlyExpenses { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ExistingLoans { get; set; }

    public int CreditScore { get; set; }

    // Loan Details
    [Column(TypeName = "decimal(18,2)")]
    public decimal RequestedAmount { get; set; }

    public int RequestedTermMonths { get; set; }

    [MaxLength(50)]
    public string Purpose { get; set; } = string.Empty;

    // Results
    public bool Eligible { get; set; }

    [MaxLength(50)]
    public string RiskCategory { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal MaxLoanAmount { get; set; }

    [MaxLength(500)]
    public string? RecommendedProductId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? RecommendedInterestRate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("RecommendedProductId")]
    public LoanProductEntity? RecommendedProduct { get; set; }
}

