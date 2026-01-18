import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080", 
      "https://justmyrides.com",
      "https://www.justmyrides.com",
      "https://justmyrides.vercel.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔥 REQUIRED FOR PREFLIGHT (VERY IMPORTANT)
app.options("*", cors());

app.use(express.json());
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
