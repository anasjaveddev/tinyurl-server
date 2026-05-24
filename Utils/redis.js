import { createClient } from "redis";

let redisClient = null;
let isRedisConnected = false;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log("⚠️  Redis max retries reached. Running without cache.");
            return false;
          }
          return Math.min(retries * 500, 2000);
        },
      },
    });

    redisClient.on("error", (err) => {
      if (isRedisConnected) {
        console.log(`⚠️  Redis Error: ${err.message}`);
      }
      isRedisConnected = false;
    });

    redisClient.on("connect", () => {
      isRedisConnected = true;
      console.log("✅ Redis Connected Successfully");
    });

    redisClient.on("end", () => {
      isRedisConnected = false;
      console.log("⚠️  Redis connection closed");
    });

    await redisClient.connect();
  } catch (error) {
    console.log(`⚠️  Redis Connection Failed: ${error.message}`);
    console.log("📌 Backend will run without Redis cache (MongoDB fallback)");
    isRedisConnected = false;
    redisClient = null;
  }
};

export const setCache = async (key, value, ttlSeconds = 86400) => {
  if (!redisClient || !isRedisConnected) return false;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log(`⚠️  Redis setCache Error: ${error.message}`);
    return false;
  }
};

export const getCache = async (key) => {
  if (!redisClient || !isRedisConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log(`⚠️  Redis getCache Error: ${error.message}`);
    return null;
  }
};

export const isRedisReady = () => isRedisConnected;