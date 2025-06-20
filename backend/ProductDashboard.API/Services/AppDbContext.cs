using Microsoft.EntityFrameworkCore;
using ProductDashboard.API.Models;


namespace ProductDashboard.API.Services;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
    }
    public DbSet<Product> Products { get; set; }
}
