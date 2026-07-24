import { createUser as createUserService, getCookieOptions, listUsers, loginUser, registerUser } from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await loginUser(req.body);

  res.cookie("token", token, getCookieOptions());
  res.status(200).json(new ApiResponse("Login successful", { token, user }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.status(200).json(new ApiResponse("Logout successful"));
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse("Current user fetched successfully", { user: req.user }));
});

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json(new ApiResponse("User registered successfully", { user }));
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(201).json(new ApiResponse("User created successfully", { user }));
});

export const users = asyncHandler(async (_req, res) => {
  const userList = await listUsers();
  res.status(200).json(new ApiResponse("Users fetched successfully", { users: userList }));
});
