namespace ProductDashboard.API.Models
{
    public class Settings
    {
        public string DbConnectionString { get; set; } = string.Empty;
        public string ProductsDbName { get; set; } = "productsdb";
        public string ProductTableName { get; set; } = "products";
    }
}
