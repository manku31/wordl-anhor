import { neon } from "@neondatabase/serverless";
import * as dotenv from "fs";

async function migrate() {
  const envFile = dotenv.readFileSync(".env", "utf-8");
  const match = envFile.match(/DATABASE_URL='([^']+)'/);
  if (!match) throw new Error("DATABASE_URL not found in .env");

  const sql = neon(match[1]);

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      username   TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  console.log("✅ users table created (or already exists)");
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
