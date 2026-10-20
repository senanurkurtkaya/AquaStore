using AquaStore.Application.Brands;
using MediatR;

namespace AquaStore.Application.Brands.Commands
{
    public record CreateBrandCommand(string Name, string? Description) : IRequest<BrandDto>;
}
