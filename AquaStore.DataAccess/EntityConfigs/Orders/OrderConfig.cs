using AquaStore.Domain.Models.Orders;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AquaStore.DataAccess.EntityConfigs.Base;

namespace AquaStore.DataAccess.EntityConfigs.Orders
{
    public class OrderConfig : BaseEntityConfig<Order>
    {
        public override void Configure(EntityTypeBuilder<Order> builder)
        {
            base.Configure(builder);
            
            builder.Property(o => o.TotalAmount)
               .HasColumnType("decimal(18,2)")
               .IsRequired();

            builder.Property(o => o.Status)
                   .IsRequired();

            builder.Property(o => o.InvoiceType)
                   .IsRequired();

            builder.Property(o => o.TCKN)
                   .HasMaxLength(11);

            builder.Property(o => o.InvoiceRegistryNumber)
                   .HasMaxLength(50);

            // ⚠️ İlişkilerde cascade yok!
            builder.HasOne(o => o.Customer)
                   .WithMany(c => c.Orders)
                   .HasForeignKey(o => o.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.DeliveryAddress)
                   .WithMany()
                   .HasForeignKey(o => o.DeliveryAddressId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(o => o.InvoiceAddress)
                   .WithMany()
                   .HasForeignKey(o => o.InvoiceAddressId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }   
}
