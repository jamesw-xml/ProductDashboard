using Microsoft.EntityFrameworkCore;
using ProductDashboard.API.Models;

public class AppDbContext : DbContext
{
    private readonly string _productTableName;

    public AppDbContext(DbContextOptions<AppDbContext> options, Settings settings)
        : base(options)
    {
        _productTableName = settings.ProductTableName;
    }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>().ToTable(_productTableName);
    }
}