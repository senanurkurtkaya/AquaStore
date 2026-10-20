using AquaStore.Application.Customers.Queries;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Customers.Handlers
{
    public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, CustomerDto?>
    {
        private readonly ICustomerRepository _customerRepository;

        public GetCustomerByIdQueryHandler(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<CustomerDto?> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
        {
            var customer = await _customerRepository.GetByIdAsync(request.Id, cancellationToken);
            if (customer is null)
                return null;

            return new CustomerDto(customer.Id, customer.FirstName, customer.LastName, customer.Email, customer.Phone);
        }
    }
}
