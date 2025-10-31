using Microsoft.AspNetCore.Mvc;

namespace LoanEligibility.API.Controllers;

[ApiController]
[Route("api/loans/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public IActionResult Health()
    {
        return Ok(new { status = "ok", service = "loan-service", timestamp = DateTime.UtcNow });
    }
}

