namespace ProductDashboard.API.Models;

public class Product
{
    public int id { get; set; }
    public string category { get; set; }
    public string name { get; set; }
    public string productcode { get; set; }
    public decimal price { get; set; }
    public int stockquantity { get; set; }
    public DateTime dateadded { get; set; }
}
