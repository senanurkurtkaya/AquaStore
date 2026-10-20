using AquaStore.DataAccess.EntityConfigs.Base;
using AquaStore.Domain.Models.Adresses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AquaStore.DataAccess.EntityConfigs.Adresses
{
    public class AddressConfig : BaseEntityConfig<Address>
    {
        public override void Configure(EntityTypeBuilder<Address> builder)
        {
            base.Configure(builder);

            builder.HasOne(address => address.Customer)
                   .WithMany(customer => customer.Addresses)
                   .HasForeignKey(address => address.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
