using AquaStore.DataAccess.Context;
using AquaStore.Domain.Models.Orders;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.DataAccess.Repositories;

public interface IOrderRepository : IBaseRepository<Order>
{
    Task<Order?> GetWithItemsAsync(Guid orderId, CancellationToken cancellationToken);
}

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Order?> GetWithItemsAsync(Guid orderId, CancellationToken cancellationToken)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
    }
}
