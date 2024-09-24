import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db,pool } from ".";

const migrateDb = async () => {
  await migrate(db, {
    migrationsFolder: "./drizzle",
  });
  await pool.end();
};

migrateDb();