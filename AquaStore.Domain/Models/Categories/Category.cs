using AquaStore.Domain.Models.Base;
using AquaStore.Domain.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Domain.Models.Categories
{
    public class Category : BaseEntity
    {
        public string Name { get; set; } = null!;
        public ICollection<Product>? Products { get; set; }
        public string? Description { get; set; }

    }
}
