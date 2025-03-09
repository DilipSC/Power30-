import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/StudentProfile");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Connection failed:", error.message);
    process.exit(1);
  }
};