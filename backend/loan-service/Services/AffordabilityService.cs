using LoanEligibility.API.Models;

namespace LoanEligibility.API.Services;

public class AffordabilityService
{
    public AffordabilityMetrics CalculateAffordability(
        EligibilityRequest request,
        LoanProduct? product,
        decimal monthlyPayment)
    {
        var monthlyIncome = request.FinancialDetails.AnnualIncome / 12;
        var totalDebt = request.FinancialDetails.ExistingLoans + monthlyPayment;
        var debtToIncomeRatio = totalDebt / monthlyIncome;
        var availableIncome = monthlyIncome - request.FinancialDetails.MonthlyExpenses;
        var safetyMargin = availableIncome > 0 
            ? ((availableIncome - monthlyPayment) / availableIncome) * 100 
            : 0;

        return new AffordabilityMetrics
        {
            MonthlyPayment = Math.Round(monthlyPayment, 2),
            DebtToIncomeRatio = Math.Round(debtToIncomeRatio, 3),
            AvailableIncome = Math.Round(availableIncome, 2),
            SafetyMargin = Math.Round(safetyMargin, 2)
        };
    }
}

