using Npgsql;

namespace ProductDashboard.API.Services;

public static class DbInitializer
{
    public static void EnsureTables(string connectionString, ILogger logger)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        const string checkTableSql = @"
            SELECT EXISTS (
                SELECT FROM pg_tables 
                WHERE schemaname = 'public' 
                AND tablename  = 'products'
            );
        ";

        using var checkCmd = new NpgsqlCommand(checkTableSql, conn);
        var exists = (bool)checkCmd.ExecuteScalar();

        if (!exists)
        {
            logger.LogInformation("Creating 'products' table...");

            const string createTableSql = @"
                CREATE TABLE public.products (
                    id SERIAL PRIMARY KEY,
                    category TEXT NOT NULL,
                    name TEXT NOT NULL,
                    productcode TEXT NOT NULL,
                    price NUMERIC(10,2) NOT NULL,
                    stockquantity INTEGER NOT NULL,
                    dateadded TIMESTAMP NOT NULL
                );
            ";

            using var createCmd = new NpgsqlCommand(createTableSql, conn);
            createCmd.ExecuteNonQuery();

            logger.LogInformation("'products' table created.");
        }
        else
        {
            logger.LogInformation("'products' table already exists.");
        }
    }
}
