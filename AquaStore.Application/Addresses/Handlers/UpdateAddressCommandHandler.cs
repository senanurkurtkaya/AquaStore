using AquaStore.Application.Addresses.Commands;
using AquaStore.DataAccess;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Addresses.Handlers
{
    public class UpdateAddressCommandHandler : IRequestHandler<UpdateAddressCommand, AddressDto?>
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateAddressCommandHandler(
            ICustomerRepository customerRepository,
            IAddressRepository addressRepository,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _addressRepository = addressRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddressDto?> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
            if (customer is null)
                return null;

            var address = await _addressRepository.GetByIdAsync(request.Id, cancellationToken);
            if (address is null || address.CustomerId != customer.Id)
                return null;

            address.Title = request.Title;
            address.Country = request.Country;
            address.City = request.City;
            address.District = request.District;
            address.Street = request.Street;
            address.PostalCode = request.PostalCode;
            address.Description = request.Description;

            _addressRepository.Update(address);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return CreateAddressCommandHandler.ToDto(address);
        }
    }
}
