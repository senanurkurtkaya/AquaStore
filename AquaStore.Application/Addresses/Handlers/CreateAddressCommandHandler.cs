using AquaStore.Application.Addresses.Commands;
using AquaStore.DataAccess;
using AquaStore.DataAccess.Repositories;
using AquaStore.Domain.Models.Adresses;
using MediatR;

namespace AquaStore.Application.Addresses.Handlers
{
    public class CreateAddressCommandHandler : IRequestHandler<CreateAddressCommand, AddressDto?>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateAddressCommandHandler(
            ICustomerRepository customerRepository,
            IAddressRepository addressRepository,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _addressRepository = addressRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddressDto?> Handle(CreateAddressCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
            if (customer is null)
                return null;

            var address = new Address
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                Title = request.Title,
                Country = request.Country,
                City = request.City,
                District = request.District,
                Street = request.Street,
                PostalCode = request.PostalCode,
                Description = request.Description
            };

            await _addressRepository.AddAsync(address, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ToDto(address);
        }

        internal static AddressDto ToDto(Address address)
        {
            return new AddressDto(
                address.Id,
                address.CustomerId,
                address.Title,
                address.Country,
                address.City,
                address.District,
                address.Street,
                address.PostalCode,
                address.Description);
        }
    }
}
