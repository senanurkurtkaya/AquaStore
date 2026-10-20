using AquaStore.Application.Orders.Queries;
using AquaStore.DataAccess.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.Application.Orders.Handlers
{
    public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderDto?>
    {
        private readonly AppDbContext _context;

        public GetOrderByIdQueryHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto?> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders
                .AsNoTracking()
                .Include(orderItem => orderItem.OrderItems)
                .FirstOrDefaultAsync(order => order.Id == request.OrderId, cancellationToken);

            return order is null ? null : OrderMapper.ToDto(order);
        }
    }
}
