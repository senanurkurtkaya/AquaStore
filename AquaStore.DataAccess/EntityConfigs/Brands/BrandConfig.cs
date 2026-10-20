using AquaStore.Domain.Models.Brands;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AquaStore.Domain.Models.Products;
using AquaStore.DataAccess.EntityConfigs.Base;

namespace AquaStore.DataAccess.EntityConfigs.Brands
{
    public class BrandConfig : BaseEntityConfig<Brand>
    {
        public override void Configure(EntityTypeBuilder<Brand> builder)
        {
            base.Configure(builder); // BaseEntity alanlarını uygula

            builder.Property(b => b.Name)
                   .HasMaxLength(100)
                   .IsRequired();

            builder.Property(b => b.Description)
                   .HasMaxLength(500);
        }
    }
}
