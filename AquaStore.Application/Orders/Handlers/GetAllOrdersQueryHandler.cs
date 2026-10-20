using AquaStore.Application.Orders.Queries;
using AquaStore.DataAccess.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.Application.Orders.Handlers
{
    public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, List<OrderDto>>
    {
        private readonly AppDbContext _context;

        public GetAllOrdersQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
        {
            var orders = await _context.Orders
                .AsNoTracking()
                .Include(order => order.OrderItems)
                .ToListAsync(cancellationToken);

            return orders.Select(OrderMapper.ToDto).ToList();
        }
    }
}
