using AquaStore.Application.Orders;
using AquaStore.Shared.Enums.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Application.Orders.Commands
{
    public class CreateOrderCommand : IRequest<OrderDto>
    {
        public Guid CustomerId { get; set; }

        public Guid DeliveryAddressId { get; set; }
        public Guid InvoiceAddressId { get; set; }

        public InvoiceType InvoiceType { get; set; } = InvoiceType.Personal;

        public string? TCKN { get; set; }
        public string? InvoiceRegistryNumber { get; set; }

        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}

