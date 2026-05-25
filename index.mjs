import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectMongoDb } from "./Utils/mongodb.js";
import URLRoute from "./Routes/urls.js";

dotenv.config();

// Connect to MongoDB
ConnectMongoDb();

const app = express();

// ✅ HEALTH CHECK ROUTE (MUST BE FIRST - For Railway)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "URL Shortener API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      save: "POST /save",
      redirect: "GET /:shortId"
    }
  });
});

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "https://*.vercel.app", "https://*.railway.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", URLRoute);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/`);
});
