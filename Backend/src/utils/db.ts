import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  
,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ Connected to Neon PostgreSQL");
});

console.log("DATABASE_URL =", process.env.DATABASE_URL);


pool.on("error", (err) => {
  console.error("❌ PostgreSQL error", err);
});
