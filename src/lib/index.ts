import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import pg from "pg";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from './schema'

export const pool = new pg.Pool({
   connectionString : "postgres://postgres:Rd@897554@localhost:5432/trueFeedback"
});
export const db = drizzle(pool , {schema : schema});

