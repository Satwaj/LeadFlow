import mongoose from "mongoose";
import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors;

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID";
  }

  if (err?.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource";
  }

  const response = { success: false, message };

  if (errors?.length) response.errors = errors;
  if (env.nodeEnv !== "production") response.stack = err.stack;

  res.status(statusCode).json(response);
};
