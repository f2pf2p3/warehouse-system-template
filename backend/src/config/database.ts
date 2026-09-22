import { PrismaClient } from "./generated/client.ts";

// Create a single Prisma Client instance for the application.
export const prisma = new PrismaClient();

// Test the database connection when the application starts.
export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log("Database connected");
}

// Close the database connection when the application shuts down.
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log("Database disconnected");
}