using Microsoft.EntityFrameworkCore;
using NLog;
using NLog.Web;
using Npgsql;
using ProductDashboard.API.Models;
using ProductDashboard.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

LogManager.Setup();

#if DOCKER
builder.Configuration.AddEnvironmentVariables();
#endif

var settings = builder.Configuration.Get<Settings>()!;

DbInitializer.EnsureDatabase(settings.DbConnectionString, settings.ProductsDbName);
var realDbConn = new NpgsqlConnectionStringBuilder(settings.DbConnectionString)
{
    Database = settings.ProductsDbName
}.ToString();
DbInitializer.EnsureTables(realDbConn, settings.ProductTableName);

builder.Services.AddSingleton(settings);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(realDbConn));
builder.Services.AddControllers();

builder.Logging.ClearProviders();
builder.UseNLog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

app.MapControllers();
app.UseHttpsRedirection();

app.Run();
