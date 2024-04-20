import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log('DB connection error = ', error)
  }
};

export default connectDB