using AquaStore.Application.Brands;
using MediatR;

namespace AquaStore.Application.Brands.Queries
{
    public record GetBrandByIdQuery(Guid Id) : IRequest<BrandDto?>;
}
