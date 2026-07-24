import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env, requireRuntimeEnv } from "./config/env.js";

const startServer = async () => {
  try {
    requireRuntimeEnv();
    await connectDB();

    app.listen(env.port, () => {
      console.log(`LeadFlow backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
