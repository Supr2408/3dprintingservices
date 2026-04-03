const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const adminAuth = require("./middleware/adminAuth");
const { ensureAppReady } = require("./lib/bootstrap");
const { getUploadDir } = require("./lib/uploadDir");

dotenv.config();

const getAllowedOrigins = () => {
  const rawOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const createApp = () => {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin not allowed by CORS."));
      },
      methods: ["GET", "POST", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"]
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.resolve(getUploadDir())));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", async (_req, _res, next) => {
    try {
      await ensureAppReady();
      next();
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/products", productsRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/admin", adminAuth, adminRoutes);

  app.use((err, _req, res, _next) => {
    if (err?.message?.includes("Invalid file type")) {
      return res.status(400).json({ message: err.message });
    }

    if (err?.message === "Origin not allowed by CORS.") {
      return res.status(403).json({ message: err.message });
    }

    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max size is 20MB." });
    }

    return res.status(500).json({ message: "Internal server error.", error: err.message });
  });

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found." });
  });

  return app;
};

module.exports = {
  createApp
};
