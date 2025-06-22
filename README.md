# DunnhumbyProject

## Backend description - API

The backend is a .NET 9 ASP.NET API, using a PostgresSQL package.

[AppContextDb.cs](./backend/ProductDashboard.API/Services/AppDbContext.cs) is a class that makes full use of Microsoft's .NET Database context. It is configured to use PostgresSQL through [Program.cs](./backend/ProductDashboard.API/Program.cs).

[DbInitialiser.cs](./backend/ProductDashboard.API/Services/DbInitialiser.cs) is a static class that ensures databases, tables and dummy data exists. It is always called on Startup from [Program.cs](/backend/ProductDashboard.API/Program.cs)

### Endpoints

#### GET

Takes no paramaters and simply calls the DI instance of AppContext, it returns a List of Products.

#### POST

This is a function that takes a Product in its body. It modifies the Product object to set DateAdded to DateTime.UTCNow;

It then calls the DI instance of AppContext, and saves the product.

On success, It returns a JSON object with the ID of the product.

### Testing
