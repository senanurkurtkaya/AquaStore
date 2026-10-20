using AquaStore.Application.Extensions;
using AquaStore.DataAccess;

namespace AquaStore.AppHost.Extansions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
        {
            services.AddApplication();
            return services;
        }

        public static IServiceCollection AddDataAccessLayer(this IServiceCollection services, IConfiguration config)
        {
            services.AddDataAccess(config);
            return services;
        }
    }
}
