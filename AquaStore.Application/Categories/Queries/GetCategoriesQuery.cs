using AquaStore.Application.Categories;
using MediatR;

namespace AquaStore.Application.Categories.Queries
{
    public record GetCategoriesQuery : IRequest<List<CategoryDto>>;
}
