﻿using Microsoft.EntityFrameworkCore;
using ProductDashboard.API.Controllers;
using ProductDashboard.API.Models;
using ProductDashboard.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using NUnit.Framework;
using FluentAssertions;

namespace ProductDashboard.Tests;

[TestFixture]
public class ProductControllerTests
{
    private AppDbContext _context;
    private ProductController _controller;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "test_db")
            .Options;

        var settings = new Settings
        {
            ProductTableName = "products"
        };

        _context = new AppDbContext(options, settings);
        _context.Database.EnsureCreated();

        _controller = new ProductController(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task Create_AddsProductToDb()
    {
        var product = new Product
        {
            name = "Test Product",
            category = "Test",
            productcode = "TEST001",
            price = 9.99m,
            stockquantity = 10
        };

        var result = await _controller.Create(product) as CreatedAtActionResult;

        result.Should().NotBeNull();
        var created = result!.Value as Product;
        created.Should().NotBeNull();
        created!.name.Should().Be("Test Product");

        var allProducts = await _context.Products.ToListAsync();
        allProducts.Should().HaveCount(1);
    }

    [Test]
    public async Task Get_ReturnsAllProducts()
    {
        _context.Products.Add(new Product
        {
            name = "P1",
            category = "Cat",
            productcode = "CODE1",
            price = 10,
            stockquantity = 5,
            dateadded = DateTime.UtcNow
        });

        _context.Products.Add(new Product
        {
            name = "P2",
            category = "Cat",
            productcode = "CODE2",
            price = 20,
            stockquantity = 10,
            dateadded = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        var result = await _controller.Get() as OkObjectResult;

        result.Should().NotBeNull();
        var products = result!.Value as List<Product>;
        products.Should().NotBeNull();
        products!.Should().HaveCount(2);
    }
}
