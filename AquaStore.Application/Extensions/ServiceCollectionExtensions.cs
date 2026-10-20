using AquaStore.Application.Behaviors;
using AquaStore.Application.Orders.Handlers;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // MediatR kayıtları
            services.AddMediatR(typeof(CreateOrderCommandHandler).Assembly);
            services.AddValidatorsFromAssembly(typeof(CreateOrderCommandHandler).Assembly);
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            return services;
        }
    }
}
