import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = (env.clientUrl || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://lead-flow-snowy-two.vercel.app",
];

const originsList = Array.from(new Set([...allowedOrigins, ...defaultOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (
        originsList.includes(normalizedOrigin) ||
        /\.vercel\.app$/.test(normalizedOrigin) ||
        normalizedOrigin.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }

      // Fallback: allow request origin
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "LeadFlow backend is healthy" });
});

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
