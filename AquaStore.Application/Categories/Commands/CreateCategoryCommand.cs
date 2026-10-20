using AquaStore.Application.Categories;
using MediatR;

namespace AquaStore.Application.Categories.Commands
{
    public record CreateCategoryCommand(string Name, string? Description) : IRequest<CategoryDto>;
}
