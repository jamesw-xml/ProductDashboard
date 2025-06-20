using Microsoft.EntityFrameworkCore;
using ProductDashboard.API.Models;
using ProductDashboard.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var settings = builder.Configuration.Get<Settings>()!;

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(settings.DbConnectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
