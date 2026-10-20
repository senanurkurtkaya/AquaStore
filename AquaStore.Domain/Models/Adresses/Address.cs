using AquaStore.Domain.Models.Base;
using AquaStore.Domain.Models.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Domain.Models.Adresses
{
    public class Address : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string Title { get; set; } = null!; 
        public string Country { get; set; } = null!;
        public string City { get; set; } = null!;
        public string District { get; set; } = null!;
        public string Street { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}