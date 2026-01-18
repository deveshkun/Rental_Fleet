import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes";

const app = express();

app.use(cors({
  origin: "*",           
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
