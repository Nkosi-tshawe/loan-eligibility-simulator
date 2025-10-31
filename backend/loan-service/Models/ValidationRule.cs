namespace LoanEligibility.API.Models;

public class ValidationRule
{
    public string Field { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // 'min', 'max', 'required', 'pattern', 'custom'
    public object? Value { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ValidationRulesResponse
{
    public List<ValidationRule> Rules { get; set; } = new();
}

