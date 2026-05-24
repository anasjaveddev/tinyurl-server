import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectMongoDB from "./Utils/mongodb.js";
import { connectRedis } from "./Utils/redis.js";
import URLRoute from "./Routes/urls.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "TinyURL Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──────────────────────────────────────────────
app.use("/", URLRoute);

// ── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global Error Handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.log(`❌ Unhandled Error: ${err.message}`);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ── Start Server ─────────────────────────────────────────
const startServer = async () => {
  // Connect to MongoDB (required)
  await connectMongoDB();

  // Connect to Redis (optional - graceful fallback)
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`🚀 I am Working!`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🔗 Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
  });
};

startServer();
