using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LoanEligibility.API.Models;
using LoanEligibility.API.Services;

namespace LoanEligibility.API.Controllers;

[ApiController]
[Route("api/loans")]
[Authorize]
public class LoanController : ControllerBase
{
    private readonly LoanEligibilityService _eligibilityService;
    private readonly LoanProductService _productService;
    private readonly RateCalculationService _rateService;
    private readonly AffordabilityService _affordabilityService;

    public LoanController(
        LoanEligibilityService eligibilityService,
        LoanProductService productService,
        RateCalculationService rateService,
        AffordabilityService affordabilityService)
    {
        _eligibilityService = eligibilityService;
        _productService = productService;
        _rateService = rateService;
        _affordabilityService = affordabilityService;
    }

    [HttpPost("eligibility")]
    public async Task<IActionResult> CheckEligibility([FromBody] EligibilityRequest request)
    {
        try
        {
            // Validate request
            if (request == null)
            {
                return BadRequest(new { error = "Request body is required" });
            }

            if (request.PersonalDetails == null)
            {
                return BadRequest(new { error = "PersonalDetails is required" });
            }

            if (request.FinancialDetails == null)
            {
                return BadRequest(new { error = "FinancialDetails is required" });
            }

            if (request.LoanDetails == null)
            {
                return BadRequest(new { error = "LoanDetails is required" });
            }

            // Validate loan purpose
            if (string.IsNullOrEmpty(request.LoanDetails.Purpose))
            {
                return BadRequest(new { error = "Loan purpose is required" });
            }

            var (eligibility, product) = _eligibilityService.CalculateEligibility(request);

            RecommendedLoan? recommendedLoan = null;
            var affordabilityMetrics = new AffordabilityMetrics();

            if (eligibility.Eligible && product != null)
            {
                var rateResponse = await _rateService.CalculateRateAsync(new CalculateRateRequest
                {
                    ProductId = product.Id,
                    Amount = request.LoanDetails.RequestedAmount,
                    TermMonths = request.LoanDetails.RequestedTermMonths,
                    PersonalDetails = request.PersonalDetails,
                    FinancialDetails = request.FinancialDetails
                });

                recommendedLoan = new RecommendedLoan
                {
                    Product = product,
                    Amount = request.LoanDetails.RequestedAmount,
                    TermMonths = request.LoanDetails.RequestedTermMonths,
                    InterestRate = rateResponse.InterestRate
                };

                affordabilityMetrics = _affordabilityService.CalculateAffordability(
                    request,
                    product,
                    rateResponse.MonthlyPayment);
            }

            var response = new EligibilityResponse
            {
                EligibilityResult = eligibility,
                RecommendedLoan = recommendedLoan,
                AffordabilityAnalysis = affordabilityMetrics
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        try
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(new { products });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("calculate-rate")]
    public async Task<IActionResult> CalculateRate([FromBody] CalculateRateRequest request)
    {
        try
        {
            var response = await _rateService.CalculateRateAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("validation-rules")]
    [AllowAnonymous]
    public IActionResult GetValidationRules()
    {
        try
        {
            var rules = new List<ValidationRule>
            {
                new ValidationRule
                {
                    Field = "age",
                    Type = "min",
                    Value = 18,
                    Message = "Age must be at least 18"
                },
                new ValidationRule
                {
                    Field = "age",
                    Type = "max",
                    Value = 75,
                    Message = "Age must be at most 75"
                },
                new ValidationRule
                {
                    Field = "annualIncome",
                    Type = "min",
                    Value = 20000,
                    Message = "Annual income must be at least $20,000"
                },
                new ValidationRule
                {
                    Field = "creditScore",
                    Type = "min",
                    Value = 300,
                    Message = "Credit score must be at least 300"
                },
                new ValidationRule
                {
                    Field = "creditScore",
                    Type = "max",
                    Value = 850,
                    Message = "Credit score must be at most 850"
                },
                new ValidationRule
                {
                    Field = "requestedAmount",
                    Type = "min",
                    Value = 1000,
                    Message = "Requested amount must be at least $1,000"
                },
                new ValidationRule
                {
                    Field = "requestedAmount",
                    Type = "max",
                    Value = 2000000,
                    Message = "Requested amount must be at most $2,000,000"
                }
            };

            return Ok(new ValidationRulesResponse { Rules = rules });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

