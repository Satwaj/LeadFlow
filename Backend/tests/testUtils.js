import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import { env } from "../src/config/env.js";
import Activity from "../src/models/activity.model.js";
import Lead from "../src/models/lead.model.js";
import User from "../src/models/user.model.js";

export const connectTestDB = async () => {
  if (!env.mongoUri) {
    throw new Error("Set MONGO_URI or TEST_MONGO_URI to run backend tests");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.mongoUri, { dbName: "leadflow_jest_test" });
  }
};

export const clearTestDB = async () => {
  await Promise.all([Activity.deleteMany({}), Lead.deleteMany({}), User.deleteMany({})]);
};

export const disconnectTestDB = async () => {
  await mongoose.connection.close();
};

export const createUser = (overrides = {}) =>
  User.create({
    name: overrides.name || "Test User",
    email: overrides.email || "user@example.com",
    password: overrides.password || "password123",
    role: overrides.role || "member",
  });

export const loginAs = async (email, password = "password123") => {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.headers["set-cookie"];
};

export const createLead = (overrides = {}) =>
  Lead.create({
    name: overrides.name || "Rahul Sharma",
    email: overrides.email || "rahul@example.com",
    phone: overrides.phone || "9999999999",
    company: overrides.company || "ABC Technologies",
    service: overrides.service || "Web Development",
    source: overrides.source || "website",
    message: overrides.message || "We need a new company website.",
    status: overrides.status || "New",
    assignedTo: overrides.assignedTo ?? null,
  });
