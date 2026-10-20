using AquaStore.DataAccess.Context;
using AquaStore.Domain.Models.Adresses;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.DataAccess.Repositories
{
    public interface IAddressRepository
    {
        Task<Address?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Address>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken);
        Task AddAsync(Address address, CancellationToken cancellationToken);
        void Update(Address address);
    }

    public class AddressRepository : IAddressRepository
    {
        private readonly AppDbContext _context;

        public AddressRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Address?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Set<Address>().FindAsync(new object[] { id }, cancellationToken);
        }

        public async Task<List<Address>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken)
        {
            return await _context.Set<Address>()
                .Where(address => address.CustomerId == customerId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Address address, CancellationToken cancellationToken)
        {
            await _context.Set<Address>().AddAsync(address, cancellationToken);
        }

        public void Update(Address address)
        {
            _context.Set<Address>().Update(address);
        }
    }
}
