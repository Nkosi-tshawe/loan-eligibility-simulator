using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoanEligibility.API.Data.Entities;

[Table("LoanProducts")]
public class LoanProductEntity
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Type { get; set; } = string.Empty; // 'secured', 'unsecured'

    [Column(TypeName = "decimal(18,2)")]
    public decimal MinAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal MaxAmount { get; set; }

    public int MinTermMonths { get; set; }

    public int MaxTermMonths { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal BaseRate { get; set; }

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}

