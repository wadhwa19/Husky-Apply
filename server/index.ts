import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import parseRoutes from "./routes/parse";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  // Resume parsing endpoint
  app.post("/api/parse-resume", parseRoutes.parseResume, parseRoutes.handleParse);
  app.post("/api/parse-text", parseRoutes.handleParseText);

  return app;
}
