import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing, ensure the database URL is correctly set in your .env file");
}

export default defineConfig({
  out: "./migrations",         // Folder to store the migration files
  schema: "./shared/schema.ts", // Path to your schema file
  dialect: "postgresql",       // Database dialect (PostgreSQL)
  dbCredentials: {
    url: process.env.DATABASE_URL,  // Use the DATABASE_URL from environment variables
  },
});
