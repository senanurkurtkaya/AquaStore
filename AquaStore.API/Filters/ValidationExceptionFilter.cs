using AquaStore.Application.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace AquaStore.API.Filters
{
    public sealed class ValidationExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is ValidationException exception)
            {
                var errors = exception.Errors
                    .GroupBy(error => error.PropertyName)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Select(error => error.ErrorMessage).ToArray());

                context.Result = new BadRequestObjectResult(new ValidationProblemDetails(errors));
                context.ExceptionHandled = true;
                return;
            }

            if (context.Exception is NotFoundException notFound)
            {
                context.Result = new NotFoundObjectResult(new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Not Found",
                    Detail = notFound.Message
                });
                context.ExceptionHandled = true;
                return;
            }

            if (context.Exception is ConflictException conflict)
            {
                context.Result = new ConflictObjectResult(new ProblemDetails
                {
                    Status = StatusCodes.Status409Conflict,
                    Title = "Conflict",
                    Detail = conflict.Message
                });
                context.ExceptionHandled = true;
            }
        }
    }
}
