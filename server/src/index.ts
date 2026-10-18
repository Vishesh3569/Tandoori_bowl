import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Tandoori Bowl API" });
});

app.listen(PORT, () => {
  console.log(`[Tandoori Bowl Server] Running on http://localhost:${PORT}`);
});