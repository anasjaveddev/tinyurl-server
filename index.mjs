import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectMongoDb } from "./Utils/mongodb.js";
import URLRoute from "./Routes/urls.js";

dotenv.config();

// Connect to MongoDB
ConnectMongoDb();

const app = express();

// ========== HEALTH CHECK ROUTE (For Railway) ==========
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "URL Shortener API is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      save: "POST /save",
      redirect: "GET /:shortId",
      check: "POST /check",
    },
  });
});

// ========== CORS Configuration ==========
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========== Middleware ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Routes ==========
app.use("/", URLRoute);

// ========== 404 Handler for unknown routes ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// ========== Global Error Handler ==========
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ========== Start Server ==========
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/`);
  console.log(`✅ Save URL: POST http://localhost:${PORT}/save`);
});
