import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";

const app = express();

/* ===============================
   🔥 DEBUG (CONFIRM DEPLOY)
   =============================== */
console.log("🔥 CORS VERSION: FINAL-FIX");

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
   ✅ CORS (THE ONLY CORRECT WAY)
   =============================== */

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❗ DO NOT THROW ERROR — THIS BREAKS PREFLIGHT
      console.warn("❌ CORS blocked:", origin);
      return callback(null, false);
    },
    credentials: true,
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

// Health check (for Render)
app.get("/", (_req, res) => {
  res.json({ status: "OK", cors: "working" });
});

/* ===============================
   ✅ SERVER START
   =============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
