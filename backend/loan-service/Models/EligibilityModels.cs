using System.Text.Json.Serialization;

namespace LoanEligibility.API.Models;

public class PersonalDetails
{
    public int Age { get; set; }
    public string EmploymentStatus { get; set; } = string.Empty; // 'employed', 'self_employed', 'retired', 'unemployed'
    public int? YearsInCurrentRole { get; set; }
}

public class FinancialDetails
{
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpenses { get; set; }
    
    // Support both "existingLoans" (from frontend model) and "existingDebt" (from payload)
    [JsonPropertyName("existingLoans")]
    public decimal ExistingLoans { get; set; }
    
    // Alternative property name for backward compatibility
    [System.Text.Json.Serialization.JsonIgnore(Condition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingDefault)]
    [System.Text.Json.Serialization.JsonPropertyName("existingDebt")]
    public decimal ExistingDebt { get => ExistingLoans; set => ExistingLoans = value; }
    
    public int CreditScore { get; set; }
}

public class LoanDetails
{
    // Support both "requestedAmount" (from frontend model) and "loanAmount" (from payload)
    [JsonPropertyName("requestedAmount")]
    public decimal RequestedAmount { get; set; }
    
    // Alternative property name for backward compatibility
    [System.Text.Json.Serialization.JsonIgnore(Condition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingDefault)]
    [System.Text.Json.Serialization.JsonPropertyName("loanAmount")]
    public decimal LoanAmount { get => RequestedAmount; set => RequestedAmount = value; }
    
    // Support both "requestedTermMonths" (from frontend model) and "loanTerm" (from payload)
    [JsonPropertyName("requestedTermMonths")]
    public int RequestedTermMonths { get; set; }
    
    // Alternative property name for backward compatibility
    [System.Text.Json.Serialization.JsonIgnore(Condition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingDefault)]
    [System.Text.Json.Serialization.JsonPropertyName("loanTerm")]
    public int LoanTerm { get => RequestedTermMonths; set => RequestedTermMonths = value; }
    
    // Support both "purpose" (from frontend model) and "loanPurpose" (from payload)
    [JsonPropertyName("purpose")]
    public string Purpose { get; set; } = string.Empty; // 'home', 'car', 'personal', 'education', 'business'
    
    // Alternative property name for backward compatibility
    [System.Text.Json.Serialization.JsonIgnore(Condition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingDefault)]
    [System.Text.Json.Serialization.JsonPropertyName("loanPurpose")]
    public string LoanPurpose { get => Purpose; set => Purpose = value; }
}

public class EligibilityRequest
{
    public PersonalDetails PersonalDetails { get; set; } = new();
    public FinancialDetails FinancialDetails { get; set; } = new();
    public LoanDetails LoanDetails { get; set; } = new();
}

public class EligibilityResult
{
    public bool Eligible { get; set; }
    public string RiskCategory { get; set; } = string.Empty; // 'low', 'medium', 'high'
    public decimal MaxLoanAmount { get; set; }
    public int RecommendedTermMonths { get; set; }
    public List<string> Reasons { get; set; } = new();
}

public class AffordabilityMetrics
{
    public decimal MonthlyPayment { get; set; }
    public decimal DebtToIncomeRatio { get; set; }
    public decimal AvailableIncome { get; set; }
    public decimal SafetyMargin { get; set; }
}

public class LoanProduct
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // 'secured', 'unsecured'
    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public int MinTermMonths { get; set; }
    public int MaxTermMonths { get; set; }
    public decimal BaseRate { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class RecommendedLoan
{
    public LoanProduct Product { get; set; } = new();
    public decimal Amount { get; set; }
    public int TermMonths { get; set; }
    public decimal InterestRate { get; set; }
}

public class EligibilityResponse
{
    public EligibilityResult EligibilityResult { get; set; } = new();
    public RecommendedLoan? RecommendedLoan { get; set; }
    public AffordabilityMetrics AffordabilityAnalysis { get; set; } = new();
}

