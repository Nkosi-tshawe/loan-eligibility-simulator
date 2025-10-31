namespace LoanEligibility.API.Models;

public class PersonalDetails
{
    public int Age { get; set; }
    public string EmploymentStatus { get; set; } = string.Empty; // 'employed', 'self_employed', 'retired', 'unemployed'
    public int? YearsInCurrentRole { get; set; }
}

public class FinancialDetails
{
    public decimal AnnualIncome { get; set; }
    public decimal MonthlyExpenses { get; set; }
    public decimal ExistingLoans { get; set; }
    public int CreditScore { get; set; }
}

public class LoanDetails
{
    public decimal RequestedAmount { get; set; }
    public int RequestedTermMonths { get; set; }
    public string Purpose { get; set; } = string.Empty; // 'home', 'car', 'personal', 'education', 'business'
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

