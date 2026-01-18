import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";

const app = express();

/* ===============================
   ✅ CORS CONFIG (PRODUCTION SAFE)
   =============================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://justmyrides.com",
  "https://www.justmyrides.com",
  "https://justmyrides.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===============================
   ✅ MIDDLEWARES
   =============================== */

app.use(express.json());

/* ===============================
   ✅ ROUTES
   =============================== */

app.use("/api/auth", authRouter);

/* ===============================
   ✅ SERVER START
   =============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
