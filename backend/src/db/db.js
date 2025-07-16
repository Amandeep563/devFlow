import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const coneectDB = async () => {
  try {
    const connectionIntance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected good ${connectionIntance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Error: ", error);
    process.exit(1);
  }
};

export default coneectDB;
