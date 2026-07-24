import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const signToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiry,
  });

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production" || process.env.RENDER === "true" || process.env.NODE_ENV === "production",
  sameSite: env.nodeEnv === "production" || process.env.RENDER === "true" || process.env.NODE_ENV === "production" ? "none" : "lax",
});

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    token: signToken(user),
    user: user.toSafeObject(),
  };
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create({ name, email, password, role: "member" });
  return {
    token: signToken(user),
    user: user.toSafeObject(),
  };
};

export const createUser = async ({ name, email, password, role = "member" }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create({ name, email, password, role });
  return user.toSafeObject();
};

export const listUsers = async () => {
  const users = await User.find({}).sort({ name: 1 });
  return users.map((user) => user.toSafeObject());
};
