import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "src/db/schema.ts",
  out: "src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "user",
    password: "pass",
    database: "sw",
    ssl: false,
  },
};

export default config;
