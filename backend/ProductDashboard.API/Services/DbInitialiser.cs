using Microsoft.Extensions.Logging;
using NLog;
using Npgsql;
using ILogger = NLog.ILogger;

namespace ProductDashboard.API.Services;

public static class DbInitializer
{
    public static ILogger Logger => LogManager.GetCurrentClassLogger();
    public static void EnsureDatabase(string fullConnStr, string targetDb)
    {
        var builder = new NpgsqlConnectionStringBuilder(fullConnStr);
        builder.Database = "postgres";
        using var adminConn = new NpgsqlConnection(builder.ConnectionString);
        adminConn.Open();

        var checkSql = $"SELECT 1 FROM pg_database WHERE datname = @dbName";
        using var checkCmd = new NpgsqlCommand(checkSql, adminConn);
        checkCmd.Parameters.AddWithValue("dbName", targetDb);

        var exists = checkCmd.ExecuteScalar() != null;

        if (!exists)
        {
            Logger.Info($"Database '{targetDb}' does not exist. Creating...");
            using var createCmd = new NpgsqlCommand($"CREATE DATABASE \"{targetDb}\"", adminConn);
            createCmd.ExecuteNonQuery();
            Logger.Info($"Database '{targetDb}' created.");
        }
        else
        {
            Logger.Info($"Database '{targetDb}' already exists.");
        }
    }
    public static void EnsureTables(string connectionString, string tableName)
    {
        using var conn = new NpgsqlConnection(connectionString);
        conn.Open();

        string checkTableSql = $@"
        SELECT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = LOWER('{tableName}')
        );
    ";

        using var checkCmd = new NpgsqlCommand(checkTableSql, conn);
        var exists = (bool)checkCmd.ExecuteScalar();

        if (!exists)
        {
            Logger.Info($"Creating '{tableName}' table...");

            string createTableSql = $@"
            CREATE TABLE IF NOT EXISTS {tableName} (
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

            Logger.Info($"'{tableName}' table created.");
        }
        else
        {
            Logger.Info($"'{tableName}' table already exists.");
        }

        // 🔍 Check if the table has any data
        string countSql = $"SELECT COUNT(*) FROM {tableName}";
        using var countCmd = new NpgsqlCommand(countSql, conn);
        var count = Convert.ToInt32(countCmd.ExecuteScalar());

        if (count == 0)
        {
            Logger.Info($"Seeding initial products into '{tableName}'...");

            string insertSql = $@"
            INSERT INTO {tableName} (category, name, productcode, price, stockquantity, dateadded)
            VALUES
                ('Electronics', 'Bluetooth Speaker', 'ELEC1001', 29.99, 50, NOW()),
                ('Food', 'Organic Apples', 'FOOD2002', 2.49, 120, NOW()),
                ('Clothes', 'Denim Jeans', 'CLOTH3003', 49.99, 75, NOW()),
                ('Electronics', 'Wireless Mouse', 'ELEC1002', 15.95, 85, NOW()),
                ('Food', 'Pasta Pack', 'FOOD2003', 1.99, 200, NOW());
        ";

            using var insertCmd = new NpgsqlCommand(insertSql, conn);
            insertCmd.ExecuteNonQuery();

            Logger.Info($"Dummy products seeded.");
        }
        else
        {
            Logger.Info($"'{tableName}' already contains data. Skipping seeding.");
        }
    }
}
