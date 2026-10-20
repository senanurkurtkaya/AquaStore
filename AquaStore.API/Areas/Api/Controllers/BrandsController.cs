using AquaStore.Application.Brands.Commands;
using AquaStore.Application.Brands.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AquaStore.API.Areas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BrandsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBrandCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBrandCommand command, CancellationToken cancellationToken)
        {
            if (id != command.Id)
                return BadRequest("Brand ID mismatch");

            var result = await _mediator.Send(command, cancellationToken);
            if (result is null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetBrandsQuery(), cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetBrandByIdQuery(id), cancellationToken);
            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}
