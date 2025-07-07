import { getAllObjectsCategories } from "@/service/objects";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { router, useFocusEffect } from "expo-router"; // 👈 Import the router object
import { openDatabaseSync } from "expo-sqlite";
import React, { useCallback } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import migrations from "../drizzle/migrations"; // Adjust the path to your migrations file

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

type CollectionType = {
  category: string;
  count: number;
  urls: string[];
  earliestCreatedAt: string;
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [collections, setCollections] = React.useState<CollectionType[]>([]);
  const { success, error } = useMigrations(db, migrations);

  if (success) {
    console.log("Migration success:", success);
  } else if (error) {
    console.error("Migration error:", error);
  }

  useFocusEffect(
    useCallback(() => {
      const categories = getAllObjectsCategories(db)?.map((category) => ({
        category: category.category,
        count: category.count,
        urls: category.urls.split(","),
        earliestCreatedAt: category.earliestCreatedAt || "",
      }));
      console.log("Fetched categories:", categories);

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
    <View style={{ flex: 1, padding: 15, paddingTop: 40, gap: 20 }}>
      <Searchbar
        placeholder="Search"
        style={{ borderRadius: 10 }}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Categories</Text>
      <ScrollView contentContainerStyle={{ flex: 1, gap: 10 }}>
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
              style={{
                width: 100,
                height: 100,
                borderRadius: 10,
              }}
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
            style={{
              backgroundColor: "lightblue",
              padding: 15,
              borderRadius: 10,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
