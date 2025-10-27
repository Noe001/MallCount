import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Malls table - stores information about all AEON Mall locations
export const malls = pgTable("malls", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  prefecture: varchar("prefecture", { length: 50 }).notNull(),
  region: varchar("region", { length: 50 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  openingDate: date("opening_date").notNull(),
  displayDate: varchar("display_date", { length: 50 }).notNull(),
});

export const insertMallSchema = createInsertSchema(malls);
export type InsertMall = z.infer<typeof insertMallSchema>;
export type Mall = typeof malls.$inferSelect;

// Visits table - stores user visit records for each mall
export const visits = pgTable("visits", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mallId: integer("mall_id").notNull().references(() => malls.id, { onDelete: "cascade" }),
  visitCount: integer("visit_count").notNull().default(0),
  lastVisitedAt: timestamp("last_visited_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("user_mall_unique").on(table.userId, table.mallId),
]);

const baseVisitSchema = createInsertSchema(visits);
export const insertVisitSchema = baseVisitSchema.pick({
  userId: true,
  mallId: true,
  visitCount: true,
  lastVisitedAt: true,
});
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;
