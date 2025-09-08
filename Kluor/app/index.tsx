import {
  getAllObjects,
  getAllObjectsCategories,
  updateObjectById,
} from "@/service/objects";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { router, useFocusEffect } from "expo-router"; // 👈 Import the router object
import React, { useCallback } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import migrations from "../drizzle/migrations"; // Adjust the path to your migrations file

import { ThemeColor, ThemeMode, ThemeStyle } from "@/utility/styling";
import { getDatabase } from "@/db/client";

const db = getDatabase();

type CollectionType = {
  category: string;
  count: number;
  urls: string[];
  earliestCreatedAt: string;
};

export default function HomeScreen() {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [collections, setCollections] = React.useState<CollectionType[]>([]);
  const { success, error } = useMigrations(db, migrations);

  if (success) {
    console.log("Migration success:", success);
  } else if (error) {
    console.error("Migration error:", error);
  }

  /**
   * This will trigger db update
   */
  useFocusEffect(
    useCallback(() => {
      let updateCounter = 0;

      // Map object map tags if empty from description split
      const allObjects = getAllObjects(db)?.map((obj) => {
        if (
          obj.tags.length === 0 &&
          obj.description !== null &&
          obj.description.trim() !== ""
        ) {
          updateCounter++;
          const tags =
            obj.tags.length === 0
              ? (obj?.description ?? "").split(",")
              : obj.tags;

          updateObjectById(db, obj.id, { ...obj, tags: tags });
          return { ...obj, tags: tags };
        }
        return obj;
      });

      if (allObjects)
        console.log(`Updated Counter: ${updateCounter}/${allObjects.length}`);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const categories = getAllObjectsCategories(db)?.map((category) => ({
        category: category.category,
        count: category.count,
        urls: category.urls.split(","),
        earliestCreatedAt: category.earliestCreatedAt || "",
      }));

      if (categories) setCollections(categories);
    }, [])
  );

  const goToCamera = () => {
    // Navigate to the 'camera.tsx' route.
    // If your CameraScreen is in app/(modals)/camera.tsx, you'd use '/camera' here.
    // If it's in app/camera.tsx, you'd also use '/camera'.
    router.push("/camera");
  };

  return (
    <View style={styling.UsableScreen}>
      <Text style={styling.TextHeader}>Collections</Text>
      <ScrollView
        horizontal={false}
        contentContainerStyle={{ flex: 1, gap: 10 }}
      >
        {collections.map((collection) => (
          <Pressable
            key={collection.category}
            style={{ flexDirection: "row", gap: 20 }}
            onPress={() =>
              router.push({
                pathname: "/category",
                params: { category: collection.category },
              })
            } // Navigate to the category screen for the category
          >
            <Image
              key={collection.urls[0]}
              style={styling.ImageContainer}
              source={{ uri: collection.urls[0] }}
              resizeMode="cover"
            />
            <View style={{ paddingVertical: 10 }}>
              <Text style={{ fontWeight: "bold" }}>{collection.category}</Text>
              <Text>{`${collection.count} items`}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={{ alignItems: "flex-end" }}>
        <Pressable onPress={goToCamera}>
          <MaterialIcons
            name="add"
            size={24}
            color="white"
            style={styling.PrimaryBtn}
          />
        </Pressable>
      </View>
    </View>
  );
}
