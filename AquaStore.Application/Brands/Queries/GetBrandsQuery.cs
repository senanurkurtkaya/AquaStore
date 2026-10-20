using AquaStore.Application.Brands;
using MediatR;

namespace AquaStore.Application.Brands.Queries
{
    public record GetBrandsQuery : IRequest<List<BrandDto>>;
}
