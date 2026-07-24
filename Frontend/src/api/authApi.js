import api from "./axiosInstance.js";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  registerPublicMember: (payload) => api.post("/auth/register", payload),
  createUserByAdmin: (payload) => api.post("/auth/users", payload),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  getUsers: () => api.get("/auth/users"),
};
