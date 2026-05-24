import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectMongoDb } from "./Utils/mongodb.js";
import URLRoute from "./Routes/urls.js";
import { connectRedis } from "./Utils/redis.js";

dotenv.config();

ConnectMongoDb();

const app = express();

// CORS setup
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectRedis();

app.use("/", URLRoute);

app.listen(process.env.PORT || 5050, () => {
  console.log("✅ I am Working on port 5050!");
});
