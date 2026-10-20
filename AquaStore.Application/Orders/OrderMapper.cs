using AquaStore.Domain.Models.Orders;

namespace AquaStore.Application.Orders
{
    public static class OrderMapper
    {
        public static OrderDto ToDto(Order order)
        {
            var items = (order.OrderItems ?? Array.Empty<OrderItem>())
                .Select(item => new OrderLineDto(
                    item.Id,
                    item.ProductId,
                    item.Quantity,
                    item.UnitPrice,
                    item.UnitPrice * item.Quantity))
                .ToList();

            return new OrderDto(
                order.Id,
                order.CustomerId,
                order.OrderDate,
                order.TotalAmount,
                order.DeliveryAddressId,
                order.InvoiceAddressId,
                order.Status,
                order.InvoiceType,
                items);
        }
    }
}
