import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";

const app = express();

/* ===============================
   🔥 DEBUG (CONFIRM DEPLOY)
   =============================== */
console.log("🔥 CORS VERSION: OPTIONS-FIXED");

/* ===============================
   ✅ ALLOWED ORIGINS
   =============================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://justmyrides.com",
  "https://www.justmyrides.com",
  "https://justmyrides.vercel.app",
];

/* ===============================
   ✅ CORS MIDDLEWARE
   =============================== */

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // IMPORTANT: do NOT throw error
      return callback(null, false);
    },
    credentials: true,
  })
);

/* ===============================
   ✅ THIS IS THE MISSING PART
   ✅ GLOBAL OPTIONS HANDLER
   =============================== */

app.options("*", cors());

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
