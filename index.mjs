import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectMongoDb } from "./Utils/mongodb.js";
import URLRoute from "./Routes/urls.js";

dotenv.config();

ConnectMongoDb();

const app = express();

// ========== HEALTH CHECK ROUTES (For Railway) ==========
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "URL Shortener API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime() 
  });
});

// ========== CORS ==========
app.use(cors({
  origin: ["http://localhost:5173", "https://*.vercel.app", "https://*.railway.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Routes ==========
app.use("/", URLRoute);

// ========== 404 Handler ==========
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
