using AquaStore.Application.Orders;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Application.Orders.Queries
{
    public record GetAllOrdersQuery() : IRequest<List<OrderDto>>;
}
