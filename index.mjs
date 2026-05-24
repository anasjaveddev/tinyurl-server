import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectMongoDb } from "./Utils/mongodb.js";
import URLRoute from "./Routes/urls.js";

dotenv.config();

ConnectMongoDb();

const app = express();

// CORS - sab allow (TinyURL ki tarah)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", URLRoute);

// TinyURL ki tarah root pe bhi kuch
app.get("/", (req, res) => {
    res.json({ message: "URL Shortener API - Like TinyURL" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ API URL: http://localhost:${PORT}`);
});