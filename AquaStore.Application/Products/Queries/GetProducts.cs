using AquaStore.Domain.Models.Products;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Application.Products.Queries
{
    public record GetProductsQuery() : IRequest<IEnumerable<Product>>;
}
