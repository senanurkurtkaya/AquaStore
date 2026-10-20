using AquaStore.Application.Addresses.Queries;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Addresses.Handlers
{
    public class GetCustomerAddressesQueryHandler : IRequestHandler<GetCustomerAddressesQuery, List<AddressDto>?>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IAddressRepository _addressRepository;

        public GetCustomerAddressesQueryHandler(
            ICustomerRepository customerRepository,
            IAddressRepository addressRepository)
        {
            _customerRepository = customerRepository;
            _addressRepository = addressRepository;
        }

        public async Task<List<AddressDto>?> Handle(GetCustomerAddressesQuery request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
            if (customer is null)
                return null;

            var addresses = await _addressRepository.GetByCustomerIdAsync(customer.Id, cancellationToken);
            return addresses.Select(CreateAddressCommandHandler.ToDto).ToList();
        }
    }
}
