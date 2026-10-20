using AquaStore.Application.Brands;
using AquaStore.Application.Brands.Queries;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Brands.Handlers
{
    public class GetBrandByIdQueryHandler : IRequestHandler<GetBrandByIdQuery, BrandDto?>
    {
        private readonly IBrandRepository _brandRepository;

        public GetBrandByIdQueryHandler(IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
        }

        public async Task<BrandDto?> Handle(GetBrandByIdQuery request, CancellationToken cancellationToken)
        {
            var brand = await _brandRepository.GetByIdAsync(request.Id, cancellationToken);
            if (brand is null)
                return null;

            return new BrandDto(brand.Id, brand.Name, brand.Description);
        }
    }
}
