using AquaStore.Application.Categories;
using AquaStore.Application.Categories.Queries;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Categories.Handlers
{
    public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetCategoryByIdQueryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            var category = await _categoryRepository.GetByIdAsync(request.Id, cancellationToken);
            if (category is null)
                return null;

            return new CategoryDto(category.Id, category.Name, category.Description);
        }
    }
}
