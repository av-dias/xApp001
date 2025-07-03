import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { objects } from "./schema";

const sqlite = openDatabaseSync("app.db");

export const db = drizzle(sqlite, { schema: { items: objects } });
