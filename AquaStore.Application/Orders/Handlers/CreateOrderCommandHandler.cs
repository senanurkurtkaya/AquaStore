using AquaStore.Application.Exceptions;
using AquaStore.Application.Orders.Commands;
using AquaStore.DataAccess;
using AquaStore.DataAccess.Context;
using AquaStore.Domain.Models.Adresses;
using AquaStore.Domain.Models.Customers;
using AquaStore.Domain.Models.Orders;
using AquaStore.Shared.Enums.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.Application.Orders.Handlers
{
    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderDto>
    {
        private readonly AppDbContext _context;
        private readonly IUnitOfWork _unitOfWork;

        public CreateOrderCommandHandler(AppDbContext context, IUnitOfWork unitOfWork)
        {
            _context = context;
            _unitOfWork = unitOfWork;
        }

        public async Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            var customerExists = await _context.Set<Customer>()
                .AsNoTracking()
                .AnyAsync(customer => customer.Id == request.CustomerId, cancellationToken);
            if (!customerExists)
                throw new NotFoundException("Müşteri bulunamadı.");

            var addressIds = new[] { request.DeliveryAddressId, request.InvoiceAddressId }.Distinct().ToList();
            var addresses = await _context.Set<Address>()
                .AsNoTracking()
                .Where(address => addressIds.Contains(address.Id))
                .Select(address => new { address.Id, address.CustomerId })
                .ToListAsync(cancellationToken);

            foreach (var addressId in addressIds)
            {
                var address = addresses.FirstOrDefault(item => item.Id == addressId);
                if (address is null || address.CustomerId != request.CustomerId)
                    throw new NotFoundException("Adres bulunamadı.");
            }

            var requestedQuantities = request.OrderItems
                .GroupBy(item => item.ProductId)
                .Select(group => new
                {
                    ProductId = group.Key,
                    Quantity = (int)group.Aggregate(0L, (sum, item) => sum + item.Quantity)
                })
                .OrderBy(item => item.ProductId)
                .ToList();

            var productIds = requestedQuantities.Select(item => item.ProductId).ToList();
            var existingProductIds = await _context.Products
                .AsNoTracking()
                .Where(product => productIds.Contains(product.Id))
                .Select(product => product.Id)
                .ToListAsync(cancellationToken);
            if (existingProductIds.Count != productIds.Count)
                throw new NotFoundException("Ürün bulunamadı.");

            await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            foreach (var requested in requestedQuantities)
            {
                var affected = await _context.Products
                    .Where(product => product.Id == requested.ProductId && product.Stock >= requested.Quantity)
                    .ExecuteUpdateAsync(
                        setters => setters.SetProperty(product => product.Stock, product => product.Stock - requested.Quantity),
                        cancellationToken);

                if (affected == 0)
                {
                    var stillExists = await _context.Products
                        .AsNoTracking()
                        .AnyAsync(product => product.Id == requested.ProductId, cancellationToken);
                    if (!stillExists)
                        throw new NotFoundException("Ürün bulunamadı.");

                    throw new ConflictException("Yetersiz stok.");
                }
            }

            var prices = await _context.Products
                .AsNoTracking()
                .Where(product => productIds.Contains(product.Id))
                .Select(product => new { product.Id, product.Price })
                .ToDictionaryAsync(product => product.Id, product => product.Price, cancellationToken);

            var orderId = Guid.NewGuid();
            var items = request.OrderItems.Select(item => new OrderItem
            {
                Id = Guid.NewGuid(),
                OrderId = orderId,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = prices[item.ProductId]
            }).ToList();

            var order = new Order
            {
                Id = orderId,
                CustomerId = request.CustomerId,
                DeliveryAddressId = request.DeliveryAddressId,
                InvoiceAddressId = request.InvoiceAddressId,
                InvoiceType = request.InvoiceType,
                TCKN = request.TCKN,
                InvoiceRegistryNumber = request.InvoiceRegistryNumber,
                OrderDate = DateTime.UtcNow,
                Status = OrderState.Pending,
                TotalAmount = items.Sum(item => item.UnitPrice * item.Quantity),
                OrderItems = items
            };

            _context.Orders.Add(order);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return OrderMapper.ToDto(order);
        }
    }
}
