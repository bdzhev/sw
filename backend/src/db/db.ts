import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';

const url = process.env.DATABASE_URL ?? 'postgresql://user:pass@localhost:5432/sw';

const client = new SQL(url, {
  max: 10,
  idleTimeout: 30,
});

export const db = drizzle(client);
