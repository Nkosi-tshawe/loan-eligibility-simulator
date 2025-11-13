using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AuthService.API.Data;
using AuthService.API.Services;
using AuthServiceClass = AuthService.API.Services.AuthService;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Authentication Service API",
        Version = "v1",
        Description = "Authentication and user management service for the Loan Eligibility System",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Loan Eligibility System",
            Email = "tag.tix9@gmail.com"
        }
    });

    // Add JWT Bearer authentication
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=authdb;Username=postgres;Password=postgres";

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LoanEligibilitySystem";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LoanEligibilityClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Register services
builder.Services.AddHttpClient<IEmailApiClient, EmailApiClient>();
builder.Services.AddScoped<AuthServiceClass>();

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

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();
    
    try
    {
        logger.LogInformation("Checking database connection...");
        
        // Retry logic for database connection
        var maxRetries = 10;
        var retryDelay = TimeSpan.FromSeconds(2);
        var connected = false;
        
        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                if (context.Database.CanConnect())
                {
                    logger.LogInformation("Database connection successful");
                    connected = true;
                    break;
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Database connection attempt {Attempt}/{MaxRetries} failed. Retrying in {Delay} seconds...", 
                    i + 1, maxRetries, retryDelay.TotalSeconds);
                if (i == maxRetries - 1)
                {
                    logger.LogError("Failed to connect to database after {MaxRetries} attempts", maxRetries);
                    throw;
                }
                Thread.Sleep(retryDelay);
            }
        }
        
        if (connected)
        {
            logger.LogInformation("Ensuring database schema is created...");
            var created = context.Database.EnsureCreated();
            
            if (created)
            {
                logger.LogInformation("Database schema created successfully");
            }
            else
            {
                logger.LogInformation("Database schema already exists");
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database");
        throw;
    }
}

// Configure pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Authentication Service API v1");
    c.RoutePrefix = "swagger";
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.EnableValidator();
});

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT") ?? "5002";
app.Run($"http://0.0.0.0:{port}");

