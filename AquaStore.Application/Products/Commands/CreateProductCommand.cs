using AquaStore.Domain.Models.Products;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Application.Products.Commands
{
    public record CreateProductCommand(
           string Name,
           string Description,
           decimal Price,
           int Stock,
           string ImageUrl,
           Guid CategoryId,
           Guid BrandId
       ) : IRequest<Product>;
}
