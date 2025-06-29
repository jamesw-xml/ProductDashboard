﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductDashboard.API.Models;
using ProductDashboard.API.Services;

namespace ProductDashboard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProductController(AppDbContext context) => _context = context;

        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            product.dateadded = DateTime.UtcNow;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Create), new { id = product.id }, product);
        }

        [HttpGet]
        public async Task<IActionResult> Get() =>
            Ok(await _context.Products.ToListAsync());
    }
}
