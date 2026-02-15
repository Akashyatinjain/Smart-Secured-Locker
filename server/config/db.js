import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected successfully");

  } catch (error) {
    console.log("Error while connecting", error.message);
    process.exit(1);
  }
};

export default ConnectDB;