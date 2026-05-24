import mongoose from "mongoose";

export const ConnectMongoDb = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/tinyurl";
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log("✅ MongoDB Connected Successfully");
        console.log(`📦 Database: ${mongoose.connection.name}`);
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        // Don't exit - let the app try to reconnect
    }
};