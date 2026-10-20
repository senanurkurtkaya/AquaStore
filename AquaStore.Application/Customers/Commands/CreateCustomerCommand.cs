using AquaStore.Application.Customers;
using MediatR;

namespace AquaStore.Application.Customers.Commands
{
    public record CreateCustomerCommand(
        string FirstName,
        string LastName,
        string Email,
        string? Phone) : IRequest<CustomerDto>;
}
