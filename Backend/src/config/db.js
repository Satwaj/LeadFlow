import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => mongoose.connect(env.mongoUri);
