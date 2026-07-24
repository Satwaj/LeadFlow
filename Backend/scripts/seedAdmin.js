import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { requireRuntimeEnv } from "../src/config/env.js";
import User from "../src/models/user.model.js";

const seedAdmin = async () => {
  requireRuntimeEnv();

  const name = INITIAL_ADMIN_NAME || "LeadFlow Admin";
  const email = (INITIAL_ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = INITIAL_ADMIN_PASSWORD || "admin123456";

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  console.log("Admin user created");
};

try {
  await connectDB();
  await seedAdmin();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close();
}
