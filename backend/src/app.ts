import express from "express";

// Import application routes.
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import inventoryRoutes from "./routes/inventory.routes";
import warehouseRoutes from "./routes/warehouse.routes";
import supplierRoutes from "./routes/supplier.routes";
import purchaseOrderRoutes from "./routes/purchase-order.routes";
import shipmentRoutes from "./routes/shipment.routes";

// Import global error middleware.
import errorMiddleware from "./middleware/error.middleware";

const app = express();

// Parse JSON request bodies.
app.use(express.json());

// Parse URL-encoded request bodies.
app.use(express.urlencoded({ extended: true }));

// Basic health-check endpoint.
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Warehouse API is running",
  });
});

// Register API routes.
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/shipments", shipmentRoutes);

// Global error handler.
// This should be registered after all routes.
app.use(errorMiddleware);

export default app;