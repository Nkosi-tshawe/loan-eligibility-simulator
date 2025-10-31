namespace LoanEligibility.API.Models;

public class CalculateRateRequest
{
    public string ProductId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int TermMonths { get; set; }
    public PersonalDetails PersonalDetails { get; set; } = new();
    public FinancialDetails FinancialDetails { get; set; } = new();
}

public class PaymentSchedule
{
    public int Month { get; set; }
    public decimal Principal { get; set; }
    public decimal Interest { get; set; }
    public decimal Total { get; set; }
    public decimal RemainingBalance { get; set; }
}

public class CalculateRateResponse
{
    public decimal InterestRate { get; set; }
    public decimal MonthlyPayment { get; set; }
    public decimal TotalPayment { get; set; }
    public decimal TotalInterest { get; set; }
    public List<PaymentSchedule> Schedule { get; set; } = new();
}

