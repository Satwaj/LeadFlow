import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.TEST_MONGO_URI || process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};

export const requireRuntimeEnv = () => {
  const missing = [];

  if (!env.mongoUri) missing.push("MONGO_URI");
  if (!env.jwtSecret) missing.push("JWT_SECRET");

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
