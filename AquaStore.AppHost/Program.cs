using AquaStore.Application.Extensions;
using AquaStore.DataAccess;

namespace AquaStore.AppHost
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Config & AppSettings.json
            var config = builder.Configuration;

            // Register Layers
            builder.Services.AddApplication();
            builder.Services.AddDataAccess(config);
            // builder.Services.AddInfrastructure(config); // varsa

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Middleware
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
