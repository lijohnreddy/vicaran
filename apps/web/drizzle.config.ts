import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/drizzle/schema/*",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Exclude ADK-managed tables from Drizzle operations
  tablesFilter: ["!app_states", "!events", "!sessions", "!user_states"],
  verbose: true,
  strict: true,
});
