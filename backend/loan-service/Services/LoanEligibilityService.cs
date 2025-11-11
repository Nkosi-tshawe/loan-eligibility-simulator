using LoanEligibility.API.Models;

namespace LoanEligibility.API.Services;

public class LoanEligibilityService
{
    private readonly LoanProductService _productService;

    public LoanEligibilityService(LoanProductService productService)
    {
        _productService = productService;
    }

    public (EligibilityResult Eligibility, LoanProduct? Product) CalculateEligibility(EligibilityRequest request)
    {
        var personal = request.PersonalDetails;
        var financial = request.FinancialDetails;
        var loan = request.LoanDetails;

        // Calculate risk category
        var riskCategory = CalculateRiskCategory(personal, financial);

        // Calculate maximum loan amount
        var maxLoanAmount = CalculateMaxLoanAmount(personal, financial, riskCategory);

        // Determine if eligible
        var eligible = personal.Age >= 18 &&
                      personal.Age <= 75 &&
                      personal.EmploymentStatus != "unemployed" &&
                      financial.CreditScore >= 600 &&
                      loan.RequestedAmount <= maxLoanAmount;

        var reasons = new List<string>();
        if (personal.Age < 18 || personal.Age > 75)
        {
            reasons.Add("Age must be between 18 and 75");
        }
        if (personal.EmploymentStatus == "unemployed")
        {
            reasons.Add("Must be employed to qualify for a loan");
        }
        if (financial.CreditScore < 600)
        {
            reasons.Add("Credit score must be at least 600");
        }
        if (loan.RequestedAmount > maxLoanAmount)
        {
            reasons.Add($"Requested amount exceeds maximum loan amount of R{maxLoanAmount:N0}");
        }

        // Recommend a product if eligible (using sync method for now)
        var product = eligible ? GetRecommendedProduct(loan) : null;

        return (new EligibilityResult
        {
            Eligible = eligible,
            RiskCategory = riskCategory,
            MaxLoanAmount = maxLoanAmount,
            RecommendedTermMonths = RecommendTerm(loan.Purpose, riskCategory),
            Reasons = reasons
        }, product);
    }

    private string CalculateRiskCategory(PersonalDetails personal, FinancialDetails financial)
    {
        var score = 0;

        // Employment risk
        if (personal.EmploymentStatus == "employed" && 
            personal.YearsInCurrentRole.HasValue && 
            personal.YearsInCurrentRole >= 2)
        {
            score += 1;
        }
        else if (personal.EmploymentStatus == "retired")
        {
            score += 2;
        }

        // Credit score risk
        if (financial.CreditScore >= 750)
        {
            score += 2;
        }
        else if (financial.CreditScore >= 650)
        {
            score += 1;
        }

        // Income risk
        var incomeRatio = financial.MonthlyExpenses / (financial.MonthlyIncome * 12);
        if (incomeRatio < 0.3m)
        {
            score += 2;
        }
        else if (incomeRatio < 0.5m)
        {
            score += 1;
        }

        if (score >= 4) return "low";
        if (score >= 2) return "medium";
        return "high";
    }

    private decimal CalculateMaxLoanAmount(PersonalDetails personal, FinancialDetails financial, string risk)
    {
        var baseMultiplier = (financial.MonthlyIncome * 12) * 0.3m; // 30% of annual income
        var riskMultipliers = new Dictionary<string, decimal>
        {
            { "low", 1.0m },
            { "medium", 0.8m },
            { "high", 0.6m }
        };
        
        if (string.IsNullOrEmpty(risk) || !riskMultipliers.TryGetValue(risk, out var multiplier))
        {
            multiplier = 0.6m; // Default to high risk multiplier
        }
        
        return Math.Floor(baseMultiplier * multiplier);
    }

    private int RecommendTerm(string purpose, string risk)
    {
        var baseTerms = new Dictionary<string, int>
        {
            { "home", 240 },
            { "car", 60 },
            { "personal", 36 },
            { "education", 48 },
            { "business", 84 }
        };
        var riskAdjustments = new Dictionary<string, decimal>
        {
            { "low", 1.0m },
            { "medium", 0.9m },
            { "high", 0.8m }
        };
        
        // Default to personal loan if purpose is not found or empty
        if (string.IsNullOrEmpty(purpose) || !baseTerms.TryGetValue(purpose, out var baseTerm))
        {
            baseTerm = 36; // Default to personal loan term
        }
        
        // Default to high risk adjustment if risk is not found or empty
        if (string.IsNullOrEmpty(risk) || !riskAdjustments.TryGetValue(risk, out var riskAdjustment))
        {
            riskAdjustment = 0.8m; // Default to high risk adjustment
        }
        
        return (int)Math.Floor(baseTerm * riskAdjustment);
    }

    private LoanProduct? GetRecommendedProduct(LoanDetails loanDetails)
    {
        var products = _productService.GetAllProducts();
        return products.FirstOrDefault(p =>
            loanDetails.RequestedAmount >= p.MinAmount &&
            loanDetails.RequestedAmount <= p.MaxAmount) 
            ?? products.FirstOrDefault();
    }

    private async Task<LoanProduct?> GetRecommendedProductAsync(LoanDetails loanDetails)
    {
        var products = await _productService.GetAllProductsAsync();
        return products.FirstOrDefault(p =>
            loanDetails.RequestedAmount >= p.MinAmount &&
            loanDetails.RequestedAmount <= p.MaxAmount) 
            ?? products.FirstOrDefault();
    }
}

