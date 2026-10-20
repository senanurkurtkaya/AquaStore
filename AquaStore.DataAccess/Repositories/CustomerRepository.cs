using AquaStore.DataAccess.Context;
using AquaStore.Domain.Models.Customers;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.DataAccess.Repositories
{
    public interface ICustomerRepository
    {
        Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task AddAsync(Customer customer, CancellationToken cancellationToken);
    }

    public class CustomerRepository : ICustomerRepository
    {
        private readonly AppDbContext _context;

        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Set<Customer>().FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task AddAsync(Customer customer, CancellationToken cancellationToken)
        {
            await _context.Set<Customer>().AddAsync(customer, cancellationToken);
        }
    }
}
