using AquaStore.Domain.Models.Adresses;
using AquaStore.Domain.Models.Base;
using AquaStore.Domain.Models.Customers;
using AquaStore.Shared.Enums.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Domain.Models.Orders
{
    public class Order : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }

        public Guid DeliveryAddressId { get; set; }
        public Guid InvoiceAddressId { get; set; }

        public Address? DeliveryAddress { get; set; }
        public Address? InvoiceAddress { get; set; }

        public OrderState Status { get; set; } = OrderState.Pending;
        public InvoiceType InvoiceType { get; set; } = InvoiceType.Personal;

        public string? TCKN { get; set; }
        public string? InvoiceRegistryNumber { get; set; }

        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
