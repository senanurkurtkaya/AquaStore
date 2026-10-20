using AquaStore.Domain.Models.Base;
using AquaStore.Domain.Models.Brands;
using AquaStore.Domain.Models.Categories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Domain.Models.Products
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; } = null!;

        public Guid CategoryId { get; set; }
        public Guid BrandId { get; set; }

        public Category? Category { get; set; }
        public Brand? Brand { get; set; }

        //public List<ProductVariant> ProductVariants => new List<ProductVariant> { };
    }

    public class ProductVariant : BaseEntity
    {
        public int ProductId { get; set; }

        public Product Product { get; set; }

        public decimal Price { get; set; }
    }
}
