using AquaStore.Application.Addresses.Commands;
using AquaStore.Application.Addresses.Queries;
using AquaStore.Application.Customers.Commands;
using AquaStore.Application.Customers.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AquaStore.API.Areas.Api.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CustomersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomerCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetCustomerByIdQuery(id), cancellationToken);
            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost("{customerId}/addresses")]
        public async Task<IActionResult> AddAddress(Guid customerId, [FromBody] CreateAddressCommand command, CancellationToken cancellationToken)
        {
            command.CustomerId = customerId;
            var result = await _mediator.Send(command, cancellationToken);
            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("{customerId}/addresses")]
        public async Task<IActionResult> GetAddresses(Guid customerId, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetCustomerAddressesQuery(customerId), cancellationToken);
            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("{customerId}/addresses/{addressId}")]
        public async Task<IActionResult> UpdateAddress(
            Guid customerId,
            Guid addressId,
            [FromBody] UpdateAddressCommand command,
            CancellationToken cancellationToken)
        {
            if (command.Id != Guid.Empty && command.Id != addressId)
                return BadRequest("Address ID mismatch");

            command.Id = addressId;
            command.CustomerId = customerId;
            var result = await _mediator.Send(command, cancellationToken);
            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}
