import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import URLRoute from "./Routes/urls.js";

dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err.message));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "URL Shortener API running" });
});

// CORS
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/", URLRoute);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
