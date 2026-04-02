const fs = require("fs");
const envFile = fs.readFileSync(".env", "utf-8");
const match = envFile.match(/DATABASE_URL='([^']+)'/);
if (!match) {
  console.error("no DATABASE_URL");
  process.exit(1);
}
const { neon } = require("@neondatabase/serverless");
const sql = neon(match[1]);
sql
  .query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  )
  .then(() => console.log("users table ready"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
