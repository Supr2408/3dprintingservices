const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const adminAuth = require("./middleware/adminAuth");
const { seedInitialData } = require("./services/seedData");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"]
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminAuth, adminRoutes);

app.use((err, _req, res, _next) => {
  if (err?.message?.includes("Invalid file type")) {
    return res.status(400).json({ message: err.message });
  }

  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large. Max size is 20MB." });
  }

  return res.status(500).json({ message: "Internal server error.", error: err.message });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected.");
      await seedInitialData();
    } else {
      console.warn("MONGO_URI not set. Running without database connection.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
