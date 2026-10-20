namespace AquaStore.Application.Addresses
{
    public record AddressDto(
        Guid Id,
        Guid CustomerId,
        string Title,
        string Country,
        string City,
        string District,
        string Street,
        string PostalCode,
        string Description);
}
