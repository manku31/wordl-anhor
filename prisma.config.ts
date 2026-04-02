import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // DIRECT_DATABASE_URL (non-pooled) is used by the Prisma CLI
    // for schema operations (db push, migrate, etc.)
    url: env("DIRECT_DATABASE_URL"),
  },
});
