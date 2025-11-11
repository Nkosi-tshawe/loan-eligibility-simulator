using System.ComponentModel.DataAnnotations;

namespace AuthService.API.Data.Entities;

public class RefreshTokenEntity
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(500)]
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsRevoked { get; set; } = false;

    // Navigation property
    public UserEntity User { get; set; } = null!;
}

