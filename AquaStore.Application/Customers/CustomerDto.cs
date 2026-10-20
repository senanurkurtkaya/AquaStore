namespace AquaStore.Application.Customers
{
    public record CustomerDto(Guid Id, string FirstName, string LastName, string Email, string? Phone);
}
