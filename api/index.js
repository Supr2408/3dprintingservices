import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { seedInitialData } from "../src/services/seedData.js";
import productsRouter from "../src/routes/products.js";
import ordersRouter from "../src/routes/orders.js";
import adminRouter from "../src/routes/admin.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/3d-print-platform");
    console.log("MongoDB connected");
    await seedInitialData();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "3D Print Platform API" });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

// Connect DB and export for Vercel
connectDB();

export default app;
