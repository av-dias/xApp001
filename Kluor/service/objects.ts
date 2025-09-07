import { NewObjectEntity, ObjectEntity, objects } from "@/db/schema";
import { count, eq, min, sql } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

const getAllObjects = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  }
) => {
  // Drizzle ORM's queries are async, wrap in Promise for expo-sqlite
  try {
    return db.select().from(objects).all();
  } catch (error) {
    console.log(error);
  }
};

const insertOneObject = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  },
  values: ObjectEntity
) => {
  // Drizzle ORM's queries are async, wrap in Promise for expo-sqlite
  try {
    values.tags = values.tags?.filter((tag) => tag.trim() !== "");

    return db.insert(objects).values(values).run();
  } catch (error) {
    console.log(error);
  }
};

const getAllObjectsCategories = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  }
) => {
  try {
    return db
      .select({
        category: objects.category,
        count: count(objects.id),
        urls: sql<string>`group_concat(${objects.url})`,
        earliestCreatedAt: min(objects.createdAt),
      })
      .from(objects)
      .groupBy(objects.category)
      .all();
  } catch (error) {
    console.log(error);
  }
};

const getAllObjectsFromCategorys = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  },
  category: string
) => {
  try {
    return db
      .select()
      .from(objects)
      .where(eq(objects.category, category))
      .all();
  } catch (error) {
    console.log(error);
  }
};

const getAvailableCategories = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  }
) => {
  try {
    const result = db
      .select({ category: objects.category })
      .from(objects)
      .groupBy(objects.category)
      .all();
    return result.map((item) => item.category);
  } catch (error) {
    console.log(error);
  }
};

const getObjectById = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  },
  id: number
) => {
  try {
    return db.select().from(objects).where(eq(objects.id, id)).get();
  } catch (error) {
    console.log(error);
  }
};

const updateObjectById = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  },
  id: number,
  values: Partial<ObjectEntity>
) => {
  try {
    values.tags = values.tags?.filter((tag) => tag.trim() !== "");

    return db.update(objects).set(values).where(eq(objects.id, id)).run();
  } catch (error) {
    console.log(error);
  }
};

const deleteObjectById = (
  db: ExpoSQLiteDatabase<Record<string, never>> & {
    $client: SQLiteDatabase;
  },
  id: number
) => {
  try {
    const result = db.delete(objects).where(eq(objects.id, id)).run();
    return result.changes === 1 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

export {
  getAllObjects,
  getAllObjectsCategories,
  getAllObjectsFromCategorys,
  getAvailableCategories,
  insertOneObject,
  getObjectById,
  updateObjectById,
  deleteObjectById,
};
