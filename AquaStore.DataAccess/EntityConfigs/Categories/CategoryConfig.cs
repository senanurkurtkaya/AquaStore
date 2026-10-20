using AquaStore.Domain.Models.Categories;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AquaStore.Domain.Models.Brands;
using AquaStore.DataAccess.EntityConfigs.Base;

namespace AquaStore.DataAccess.EntityConfigs.Categories
{
    public class CategoryConfig : BaseEntityConfig<Category>
    {
        public override void Configure(EntityTypeBuilder<Category> builder)
        {
            base.Configure(builder); // Ortak alanlar: Id, CreatedDate, vb.

            builder.Property(c => c.Name)
                   .HasMaxLength(100)
                   .IsRequired();

            builder.Property(c => c.Description)
                   .HasMaxLength(500);
        }
    }
}
