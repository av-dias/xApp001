import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type ObjectEntity = {
  id?: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  url: string;
  createdAt?: string;
};

export type NewObjectEntity = {
  id?: number;
  name?: string;
  category?: string;
  description?: string;
  rating?: number;
  url?: string;
  createdAt?: string;
};

export const objects = sqliteTable("objects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  rating: integer("rating").notNull(),
  url: text("url").notNull(),
  createdAt: text("createdAt").notNull().default("CURRENT_TIMESTAMP"),
});
