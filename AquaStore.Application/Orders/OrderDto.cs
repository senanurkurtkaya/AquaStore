using AquaStore.Shared.Enums.Enums;

namespace AquaStore.Application.Orders
{
    public record OrderLineDto(Guid Id, Guid ProductId, int Quantity, decimal UnitPrice, decimal LineTotal);

    public record OrderDto(
        Guid Id,
        Guid CustomerId,
        DateTime OrderDate,
        decimal TotalAmount,
        Guid DeliveryAddressId,
        Guid InvoiceAddressId,
        OrderState Status,
        InvoiceType InvoiceType,
        IReadOnlyList<OrderLineDto> Items);
}
