import axios from "axios";

let rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
rawBaseURL = rawBaseURL.trim().replace(/\/$/, "");

const baseURL = rawBaseURL.endsWith("/api") ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
