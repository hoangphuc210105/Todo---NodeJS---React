import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Liên kết thành công CSDL");
  } catch (error) { 
    console.error("Lỗi từ MongoDB:", error);
    process.exit(1);
  }
};