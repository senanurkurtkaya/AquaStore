using AquaStore.Application.Customers;
using MediatR;

namespace AquaStore.Application.Customers.Queries
{
    public record GetCustomerByIdQuery(Guid Id) : IRequest<CustomerDto?>;
}
