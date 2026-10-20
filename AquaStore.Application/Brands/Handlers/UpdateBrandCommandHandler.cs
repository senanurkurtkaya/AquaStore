using AquaStore.Application.Brands;
using AquaStore.Application.Brands.Commands;
using AquaStore.DataAccess;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Brands.Handlers
{
    public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand, BrandDto?>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateBrandCommandHandler(IBrandRepository brandRepository, IUnitOfWork unitOfWork)
        {
            _brandRepository = brandRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<BrandDto?> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
        {
            var brand = await _brandRepository.GetByIdAsync(request.Id, cancellationToken);
            if (brand is null)
                return null;

            brand.Name = request.Name;
            brand.Description = request.Description;
            _brandRepository.Update(brand);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new BrandDto(brand.Id, brand.Name, brand.Description);
        }
    }
}
