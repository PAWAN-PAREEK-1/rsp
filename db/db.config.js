import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect('')
    console.log('Connected to mongodb')
  } catch (error) {
    console.log('DB connection error = ', error)
  }
};


export default connectDB