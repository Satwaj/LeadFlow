import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = user.toSafeObject();
  next();
});
