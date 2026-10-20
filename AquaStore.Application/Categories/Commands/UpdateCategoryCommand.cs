using AquaStore.Application.Categories;
using MediatR;

namespace AquaStore.Application.Categories.Commands
{
    public class UpdateCategoryCommand : IRequest<CategoryDto?>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
