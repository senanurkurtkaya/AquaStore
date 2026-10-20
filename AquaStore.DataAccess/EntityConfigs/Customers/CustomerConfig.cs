using AquaStore.Domain.Models.Customers;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AquaStore.Domain.Models.Categories;
using AquaStore.DataAccess.EntityConfigs.Base;

namespace AquaStore.DataAccess.EntityConfigs.Customers
{
    
   public class CustomerConfig : BaseEntityConfig<Customer>
    {
        public override void Configure(EntityTypeBuilder<Customer> builder)
        {
            base.Configure(builder); // Ortak alanlar

            builder.Property(c => c.FirstName)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(c => c.LastName)
                   .HasMaxLength(50)
                   .IsRequired();

            builder.Property(c => c.Email)
                   .HasMaxLength(100)
                   .IsRequired();

            builder.Property(c => c.Phone)
                   .HasMaxLength(20);
        }
    }
}
