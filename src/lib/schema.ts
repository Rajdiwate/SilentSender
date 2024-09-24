import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email : text("email").notNull().unique(),
  hashPassword: text("hashed_password"),
  verifyCode: text("verify_code").notNull(),
  verifyCodeExpiry: timestamp("veriy_code_expiry").notNull(),
  isVerified : boolean("is_verified").default(false),
  isAccepting: boolean("is_accepting").default(false),
  googleId: text("google_id").unique(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const messageTable = pgTable("messaage", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: text("user_id") // foreign key to reference user table
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});


//For querying  the messssages for a user

// const userWithMessages = await db.select({
// 	user: userTable,        // Selecting from the 'userTable'
// 	messages: db            // Selecting from the 'messageTable'
// 	  .select(messageTable) // Fetch all columns from 'messageTable'
// 	  .where(messageTable.userId.equals(userTable.id)), // Filter messages where 'messageTable.userId' matches 'userTable.id'
//   }).where(userTable.id.equals('some-user-id')); // Filter users where 'userTable.id' matches 'some-user-id'
  
  