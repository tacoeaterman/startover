import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  hasHostingPrivilege: boolean("has_hosting_privilege").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameCode: varchar("game_code", { length: 6 }).notNull().unique(),
  hostId: varchar("host_id").notNull(),
  courseName: text("course_name"),
  totalHoles: integer("total_holes").notNull(),
  currentHole: integer("current_hole").default(1),
  currentPar: integer("current_par").default(3),
  gamePhase: varchar("game_phase").notNull().default("lobby"), // lobby, playing, finished
  players: jsonb("players").default({}),
  scores: jsonb("scores").default({}),
  gameActivity: jsonb("game_activity").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  gameCode: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
