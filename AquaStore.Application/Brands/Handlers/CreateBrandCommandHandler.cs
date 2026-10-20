using AquaStore.Application.Brands;
using AquaStore.Application.Brands.Commands;
using AquaStore.DataAccess;
using AquaStore.DataAccess.Repositories;
using AquaStore.Domain.Models.Brands;
using MediatR;

namespace AquaStore.Application.Brands.Handlers
{
    public class CreateBrandCommandHandler : IRequestHandler<CreateBrandCommand, BrandDto>
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateBrandCommandHandler(IBrandRepository brandRepository, IUnitOfWork unitOfWork)
        {
            _brandRepository = brandRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<BrandDto> Handle(CreateBrandCommand request, CancellationToken cancellationToken)
        {
            var brand = new Brand
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description
            };

            await _brandRepository.AddAsync(brand, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new BrandDto(brand.Id, brand.Name, brand.Description);
        }
    }
}
