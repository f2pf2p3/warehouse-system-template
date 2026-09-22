// Load environment variables from .env.
import dotenv from "dotenv";
dotenv.config();

// Import Prisma configuration helper.
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Prisma schema location.
  schema: "prisma/schema.prisma",

  // Migration files location.
  migrations: {
    path: "prisma/migrations"
  },

  // Database connection URL used by Prisma CLI and migrations.
  datasource: {
    url: process.env["DATABASE_URL"]
  }
});