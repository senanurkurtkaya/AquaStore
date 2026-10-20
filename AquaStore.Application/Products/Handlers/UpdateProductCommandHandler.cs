using AquaStore.Application.Exceptions;
using AquaStore.Application.Products.Commands;
using AquaStore.DataAccess;
using AquaStore.DataAccess.Context;
using AquaStore.DataAccess.Repositories;
using AquaStore.Domain.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AquaStore.Application.Products.Handlers
{
    public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Guid>
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppDbContext _context;

        public UpdateProductCommandHandler(
            IProductRepository productRepository,
            IUnitOfWork unitOfWork,
            AppDbContext context)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task<Guid> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (product == null)
                throw new Exception("Ürün bulunamadı.");

            var originalStock = product.Stock;
            var stockChanged = request.Stock != originalStock;

            if (stockChanged)
            {
                await using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

                var affected = await _context.Products
                    .Where(item => item.Id == product.Id && item.Stock == originalStock)
                    .ExecuteUpdateAsync(
                        setters => setters.SetProperty(item => item.Stock, request.Stock),
                        cancellationToken);

                if (affected == 0)
                {
                    var stillExists = await _context.Products
                        .AsNoTracking()
                        .AnyAsync(item => item.Id == product.Id, cancellationToken);
                    if (!stillExists)
                        throw new NotFoundException("Ürün bulunamadı.");

                    throw new ConflictException("Stok başka bir işlem tarafından değiştirildi.");
                }

                ApplyNonStockChanges(product, request);
                PreventTrackedStockWrite(product);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);
                return product.Id;
            }

            ApplyNonStockChanges(product, request);
            PreventTrackedStockWrite(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return product.Id;
        }

        private static void ApplyNonStockChanges(Product product, UpdateProductCommand request)
        {
            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.ImageUrl = request.ImageUrl;
            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;
        }

        private void PreventTrackedStockWrite(Product product)
        {
            _context.Entry(product).Property(item => item.Stock).IsModified = false;
        }
    }
}
