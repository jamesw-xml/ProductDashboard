# DunnhumbyProject

## Backend description - API

The backend is a .NET 9 ASP.NET API, using a PostgresSQL package.

[AppContextDb.cs](./backend/ProductDashboard.API/Services/AppDbContext.cs) is a class that makes full use of Microsoft's .NET Database context. It is configured to use PostgresSQL through [Program.cs](./backend/ProductDashboard.API/Program.cs).

[DbInitialiser.cs](./backend/ProductDashboard.API/Services/DbInitialiser.cs) is a static class that ensures databases, tables and dummy data exists. It is always called on Startup from [Program.cs](/backend/ProductDashboard.API/Program.cs)

### Endpoints

#### GET

Takes no parameters and simply calls the DI instance of AppContext, it returns a List of Products.

#### POST

This is a function that takes a Product in its body. It modifies the Product object to set DateAdded to DateTime.UTCNow;

It then calls the DI instance of AppContext, and saves the product.

On success, It returns a JSON object with the ID of the product.

### Testing

The backend [tests](./backend/ProductDashboard.Tests/ControllerTests.cs) involve testing the two endpoints.

It ensures both endpoints will carry out their expected behaviour by using an In-Memory collection to mock the AppDbContext

---

## Frontend description - Product Dashboard

The frontend is a Next.js 14 React application located in [`frontend/product-dashboard`](./frontend/product-dashboard). It provides a dashboard for viewing and analyzing products from the backend API.

### Features

- **Product Table:** Displays a sortable and filterable table of products.
- **Stock Chart:** Visualizes stock per category using a bar chart (Chart.js).
- **API Integration:** Fetches product data from the backend API using Axios.
- **Responsive UI:** Styled with Tailwind CSS.

### Environment Variables

The frontend uses the following environment variable:

- `NEXT_PUBLIC_API_URL`: The base URL for the backend API (e.g., `http://localhost:8080/api`).

## Running this locally

### Prerequisites

 - Docker

### Instructions

In the root folder, there is a docker compose file and a .env file which provides variables for the database, frontend and backend. Adjust this .env file to your needs.

Do not commit this env file, it is to be removed for any production releases.

From the terminal run:

```bash
docker-compose up --build
```
