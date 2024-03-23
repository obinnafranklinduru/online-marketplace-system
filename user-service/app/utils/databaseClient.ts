import { Client } from "pg";

// Function to create a PostgreSQL database client
export const DBClient = () => {
  return new Client({
    host: process.env.DB_HOST! || "127.0.0.1", // Set the host address for the database
    user: process.env.DB_USER! || "root", // Set the database user
    database: process.env.DB_NAME! || "user_service", // Set the database name
    password: process.env.DB_PASSWORD! || "root", // Set the database password
    port: Number(process.env.DB_PORT!) || 5432, // Set the database port
  });
};
