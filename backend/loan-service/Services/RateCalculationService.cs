using LoanEligibility.API.Models;

namespace LoanEligibility.API.Services;

public class RateCalculationService
{
    private readonly LoanProductService _productService;

    public RateCalculationService(LoanProductService productService)
    {
        _productService = productService;
    }

    public async Task<CalculateRateResponse> CalculateRateAsync(CalculateRateRequest request)
    {
        var product = await _productService.GetProductByIdAsync(request.ProductId);
        if (product == null)
        {
            throw new ArgumentException("Product not found");
        }

        // Calculate risk-adjusted interest rate
        var interestRate = CalculateInterestRate(request, product.BaseRate);

        var rate = interestRate / 100 / 12; // Monthly rate
        var term = request.TermMonths;

        // Calculate monthly payment using standard amortization formula
        var monthlyPayment = (request.Amount * rate * (decimal)Math.Pow((double)(1 + rate), term)) /
                            ((decimal)Math.Pow((double)(1 + rate), term) - 1);

        // Generate payment schedule
        var schedule = new List<PaymentSchedule>();
        var balance = request.Amount;

        for (var month = 1; month <= term; month++)
        {
            var interest = balance * rate;
            var principal = monthlyPayment - interest;
            balance -= principal;

            schedule.Add(new PaymentSchedule
            {
                Month = month,
                Principal = Math.Round(principal, 2),
                Interest = Math.Round(interest, 2),
                Total = Math.Round(monthlyPayment, 2),
                RemainingBalance = Math.Round(balance, 2)
            });
        }

        return new CalculateRateResponse
        {
            InterestRate = Math.Round(interestRate, 2),
            MonthlyPayment = Math.Round(monthlyPayment, 2),
            TotalPayment = Math.Round(monthlyPayment * term, 2),
            TotalInterest = Math.Round((monthlyPayment * term - request.Amount), 2),
            Schedule = schedule
        };
    }

    // Synchronous method for backward compatibility
    public CalculateRateResponse CalculateRate(CalculateRateRequest request)
    {
        return CalculateRateAsync(request).GetAwaiter().GetResult();
    }

    private decimal CalculateInterestRate(CalculateRateRequest request, decimal baseRate)
    {
        var rate = baseRate;

        // Adjust based on credit score
        if (request.FinancialDetails.CreditScore >= 750)
        {
            rate -= 1.0m;
        }
        else if (request.FinancialDetails.CreditScore >= 650)
        {
            rate -= 0.5m;
        }
        else
        {
            rate += 1.0m;
        }

        // Adjust based on employment
        if (request.PersonalDetails.EmploymentStatus == "employed" &&
            request.PersonalDetails.YearsInCurrentRole.HasValue &&
            request.PersonalDetails.YearsInCurrentRole >= 5)
        {
            rate -= 0.5m;
        }

        return Math.Max(3.0m, rate); // Minimum rate floor
    }
}

