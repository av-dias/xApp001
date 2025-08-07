import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type ObjectEntity = {
  id?: number;
  name: string;
  category: string;
  tags: string[];
  rating: number;
  url: string;
  createdAt?: string;
};

export type NewObjectEntity = {
  id?: number;
  name?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  url?: string;
  createdAt?: string;
};

export const objects = sqliteTable("objects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"), // remove description later on
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default([]),
  rating: integer("rating").notNull(),
  url: text("url").notNull(),
  createdAt: text("createdAt").notNull().default("CURRENT_TIMESTAMP"),
});
