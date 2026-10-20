using AquaStore.Application.Addresses;
using MediatR;

namespace AquaStore.Application.Addresses.Queries
{
    public record GetCustomerAddressesQuery(Guid CustomerId) : IRequest<List<AddressDto>?>;
}
