import mongoose from "mongoose";
import { mongoDB_name } from "../constants.js";
import logger from "./logger.js";


export const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI,{dbName:mongoDB_name});
        logger.info(
          `Database connected | Host: ${connectionInstance.connection.host}`
        );

    } catch (error) {
        logger.error('Database connection failed: ' + error.message);
        process.exit(1)
    }
}
