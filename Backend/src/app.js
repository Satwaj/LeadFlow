import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
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
