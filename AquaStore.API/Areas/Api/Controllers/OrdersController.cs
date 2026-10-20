using AquaStore.Application.Orders.Commands;
using AquaStore.Application.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AquaStore.API.Areas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderCommand command, CancellationToken cancellationToken)
        {
            var order = await _mediator.Send(command, cancellationToken);
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var orders = await _mediator.Send(new GetAllOrdersQuery(), cancellationToken);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var order = await _mediator.Send(new GetOrderByIdQuery(id), cancellationToken);
            if (order is null)
                return NotFound();

            return Ok(order);
        }
    }
}
