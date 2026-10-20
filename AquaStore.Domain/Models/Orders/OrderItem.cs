using AquaStore.Domain.Models.Base;
using AquaStore.Domain.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Domain.Models.Orders
{
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }

        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        // Toplam tutar (Quantity * UnitPrice)
        public decimal TotalPrice => Quantity * UnitPrice;
    }
}
