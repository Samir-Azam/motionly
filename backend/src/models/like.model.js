import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`\n📦 MongoDB connected`);
    console.log(`📍 DB Host: ${connectionInstance.connection.host}\n`);
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error);
    process.exit(1); // Exit the app if DB fails
  }
};
