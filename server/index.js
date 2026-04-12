import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import errorHandler from "./src/middleware/errorHandler.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import listRoutes from "./src/routes/listRoutes.js";
import tagRoutes from "./src/routes/tagRoutes.js";
import templateRoutes from "./src/routes/templateRoutes.js";
import habitRoutes from "./src/routes/habitRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/tasks",taskRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/habits", habitRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown handlers
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    console.log("HTTP server closed. Disconnecting from MongoDB...");
    try {
      const mongoose = await import("mongoose");
      await mongoose.default.disconnect();
      console.log("MongoDB disconnected. Shutdown complete.");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("Forced shutdown: server did not close within 10s");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
