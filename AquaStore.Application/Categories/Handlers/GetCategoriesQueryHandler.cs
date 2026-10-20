using AquaStore.Application.Categories;
using AquaStore.Application.Categories.Queries;
using AquaStore.DataAccess.Repositories;
using MediatR;

namespace AquaStore.Application.Categories.Handlers
{
    public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
    {
        private readonly ICategoryRepository _categoryRepository;

        public GetCategoriesQueryHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
        {
            var categories = await _categoryRepository.GetAllAsync(cancellationToken);
            return categories
                .Select(category => new CategoryDto(category.Id, category.Name, category.Description))
                .ToList();
        }
    }
}
