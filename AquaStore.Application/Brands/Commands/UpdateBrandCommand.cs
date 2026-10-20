using AquaStore.Application.Brands;
using MediatR;

namespace AquaStore.Application.Brands.Commands
{
    public class UpdateBrandCommand : IRequest<BrandDto?>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
