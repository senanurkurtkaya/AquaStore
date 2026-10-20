using AquaStore.DataAccess.Context;
using AquaStore.Domain.Models.Products;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.DataAccess.Repositories;

public interface IProductRepository : IBaseRepository<Product>
{
    Task<List<Product>> GetProductsByCategoryAsync(Guid categoryId, CancellationToken cancellationToken);
}

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Product>> GetProductsByCategoryAsync(Guid categoryId, CancellationToken cancellationToken)
    {
        return await _dbSet
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
    }
}
