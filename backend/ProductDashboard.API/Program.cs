using Microsoft.EntityFrameworkCore;
using NLog;
using Npgsql;
using ProductDashboard.API.Models;
using ProductDashboard.API.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

LogManager.Setup();

var settings = builder.Configuration.Get<Settings>()!;

DbInitializer.EnsureDatabase(settings.DbConnectionString, settings.ProductsDbName);
DbInitializer.EnsureTables(settings.DbConnectionString);

var realDbConn = new NpgsqlConnectionStringBuilder(settings.DbConnectionString)
{
    Database = settings.ProductsDbName
}.ToString();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(realDbConn));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
