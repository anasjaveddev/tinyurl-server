import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.log("⚠️ Redis connection failed, continuing without Redis:", err.message);
  }
};

export const setCache = async (key, value, expireSeconds = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expireSeconds,
    });
  } catch (err) {
    console.log("Cache set error:", err);
  }
};

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("Cache get error:", err);
    return null;
  }
};

export default redisClient;