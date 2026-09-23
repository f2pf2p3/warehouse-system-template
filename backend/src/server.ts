import app from "./app";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database";

const PORT = process.env.PORT || 5000;

// Start the application.
async function startServer(): Promise<void> {
  try {
    // Connect to PostgreSQL before accepting requests.
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Gracefully close the database connection.
async function shutdown(): Promise<void> {
  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();