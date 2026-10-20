using AquaStore.Domain.Models.Base;
using AquaStore.Domain.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Domain.Models.Brands
{
    public class Brand : BaseEntity
    {
        public string Name { get; set; } = null!;

        public string? Description { get; set; }
        
        public ICollection<Product>? Products { get; set; }
    }
}
