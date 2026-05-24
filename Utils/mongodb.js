import mongoose from "mongoose";

export const ConnectMongoDb = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/tinyurl";
    await mongoose.connect(mongoURI);
    console.log("✅ DB Connected");
  } catch (err) {
    console.log("❌ DB Connection Error:", err.message);
    console.log("Full error:", err);
  }
};