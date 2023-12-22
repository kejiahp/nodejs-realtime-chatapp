import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

mongoose.set("strictQuery", true);
const MONGODB_URI = config.get<string>("MONGODB_URI");

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("connected to DB");
  } catch (error: any) {
    logger.error("can't connect to DB");
    process.exit(1);
  }
};

export default dbConnect;
