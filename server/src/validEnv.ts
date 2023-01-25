import * as dotenv from "dotenv";

// Load .env file contents into process.env
dotenv.config();

// Check if PORT environment variable ise defined or exit the process
if (!process.env.DATABASE_URL || !process.env.PORT) {
  console.error(
    "ERROR: DATABASE_URL and PORT must be properly defined in .env file."
  );
  process.exit(1);
}

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT, 10),
};
