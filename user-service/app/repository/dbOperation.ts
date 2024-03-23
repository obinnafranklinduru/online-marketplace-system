import { DBClient } from "../utils/databaseClient";

export class DBOperation {
  constructor() {}

  // Method to execute a query on the database
  async executeQuery(queryString: string, values: unknown[]) {
    const client = await DBClient(); // Create a database client
    await client.connect(); // Connect to the database
    const result = await client.query(queryString, values); // Execute the query
    await client.end(); // Close the database connection
    return result; // Return the query result
  }
}
