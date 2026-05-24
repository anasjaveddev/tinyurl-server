import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient = null;

export const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    
    redisClient = createClient({
      url: redisUrl
    });
    
    redisClient.on("error", (err) => {
      console.log("⚠️ Redis not available, continuing without Redis");
    });
    
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.log("⚠️ Redis disabled - continuing without Redis");
    redisClient = null;
  }
};

export const setCache = async (key, value, expireSeconds = 3600) => {
  try {
    if (!redisClient) return null;
    await redisClient.set(key, JSON.stringify(value), {
      EX: expireSeconds,
    });
  } catch (err) {
    console.log("Cache set error:", err);
  }
};

export const getCache = async (key) => {
  try {
    if (!redisClient) return null;
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("Cache get error:", err);
    return null;
  }
};

export default redisClient;
