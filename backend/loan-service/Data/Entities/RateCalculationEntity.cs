using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoanEligibility.API.Data.Entities;

[Table("RateCalculations")]
public class RateCalculationEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string ProductId { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public int TermMonths { get; set; }

    public int CreditScore { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal CalculatedInterestRate { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MonthlyPayment { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPayment { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalInterest { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [ForeignKey("ProductId")]
    public LoanProductEntity? Product { get; set; }
}

