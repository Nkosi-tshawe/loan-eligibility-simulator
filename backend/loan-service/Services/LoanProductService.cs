using Microsoft.EntityFrameworkCore;
using LoanEligibility.API.Models;
using LoanEligibility.API.Data;
using LoanEligibility.API.Data.Entities;

namespace LoanEligibility.API.Services;

public class LoanProductService
{
    private readonly LoanEligibilityDbContext _context;

    public LoanProductService(LoanEligibilityDbContext context)
    {
        _context = context;
    }

    public async Task<List<LoanProduct>> GetAllProductsAsync()
    {
        var entities = await _context.LoanProducts
            .Where(p => p.IsActive)
            .ToListAsync();

        return entities.Select(MapToModel).ToList();
    }

    public async Task<LoanProduct?> GetProductByIdAsync(string id)
    {
        var entity = await _context.LoanProducts
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);

        return entity == null ? null : MapToModel(entity);
    }

    public async Task<LoanProductEntity?> GetProductEntityByIdAsync(string id)
    {
        return await _context.LoanProducts
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
    }

    private static LoanProduct MapToModel(LoanProductEntity entity)
    {
        return new LoanProduct
        {
            Id = entity.Id,
            Name = entity.Name,
            Type = entity.Type,
            MinAmount = entity.MinAmount,
            MaxAmount = entity.MaxAmount,
            MinTermMonths = entity.MinTermMonths,
            MaxTermMonths = entity.MaxTermMonths,
            BaseRate = entity.BaseRate,
            Description = entity.Description
        };
    }

    // Synchronous methods for backward compatibility
    public List<LoanProduct> GetAllProducts()
    {
        return GetAllProductsAsync().GetAwaiter().GetResult();
    }

    public LoanProduct? GetProductById(string id)
    {
        return GetProductByIdAsync(id).GetAwaiter().GetResult();
    }
}

