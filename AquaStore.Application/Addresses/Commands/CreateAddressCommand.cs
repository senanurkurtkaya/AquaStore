using AquaStore.Application.Addresses;
using MediatR;

namespace AquaStore.Application.Addresses.Commands
{
    public class CreateAddressCommand : IRequest<AddressDto?>
    {
        public Guid CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
