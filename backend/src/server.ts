import express from "express";

const app = express();

const PORT = 5000;

// Parse JSON request bodies.
app.use(express.json());

// Basic health-check endpoint.
app.get("/", (_req, res) => {
  res.json({
    message: "Warehouse Management System API",
    status: "running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});