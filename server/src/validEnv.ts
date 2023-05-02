import * as dotenv from "dotenv";

// Load .env file contents into process.env
dotenv.config();
console.log("Working directory:", process.cwd());
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SERVER_URL:", process.env.SERVER_URL);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("UPLOADS_BASE_PATH:", process.env.UPLOADS_BASE_PATH);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("PORT:", process.env.PORT);

// Check if PORT environment variable ise defined or exit the process
if (!process.env.DATABASE_URL || !process.env.PORT) {
  console.error("ERROR: DATABASE_URL and PORT must be explicitly defined in .env file.");
  process.exit(1);
}

export default {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  SERVER_URL: process.env.SERVER_URL ?? "http://localhost:3000",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
  UPLOADS_BASE_PATH: process.env.UPLOADS_BASE_PATH ?? "c:\\",
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT, 10),
};
