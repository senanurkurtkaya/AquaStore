using AquaStore.DataAccess.Context;
using AquaStore.Domain.Models.Brands;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.DataAccess.Repositories
{
    public interface IBrandRepository
    {
        Task<List<Brand>> GetAllAsync(CancellationToken cancellationToken);
        Task<Brand?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task AddAsync(Brand brand, CancellationToken cancellationToken);
        void Update(Brand brand);
        void Remove(Brand brand);
    }

    public class BrandRepository : IBrandRepository
    {
        private readonly AppDbContext _context;

        public BrandRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Brand>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Brands.ToListAsync(cancellationToken);
        }

        public async Task<Brand?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Brands.FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task AddAsync(Brand brand, CancellationToken cancellationToken)
        {
            await _context.Brands.AddAsync(brand, cancellationToken);
        }

        public void Update(Brand brand)
        {
            _context.Brands.Update(brand);
        }

        public void Remove(Brand brand)
        {
            _context.Brands.Remove(brand);
        }
    }
}