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
    public static void EnsureTables(string connectionString)
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
            Logger.Info("Creating 'products' table...");

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

            Logger.Info("'products' table created.");
        }
        else
        {
            Logger.Info("'products' table already exists.");
        }
    }
}
