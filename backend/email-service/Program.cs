var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Email Service API",
        Version = "v1",
        Description = "Email notification service for the Loan Eligibility System",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "LoanQuest",
            Email = "tag.tix9@gmail.com"
        }
    });
});

// Register services
builder.Services.AddHttpClient();
builder.Services.AddScoped<EmailService.API.Services.IEmailService, EmailService.API.Services.EmailService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Email Service API v1");
    c.RoutePrefix = "swagger";
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.EnableValidator();
});

app.UseCors("AllowAll");
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5004";
app.Run($"http://0.0.0.0:{port}");

