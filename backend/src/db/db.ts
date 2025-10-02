import mongoose from "mongoose";
const connectDataBase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );

    console.log("MongoDB connected:", connectionInstance.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
export default connectDataBase;
