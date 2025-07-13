import { AlertBox } from "@/components/AlertBox/AlertBox";
import { Button } from "@/components/Button/Button";
import { TagGroup } from "@/components/TagGroup/TagGroup";
import { ObjectEntity } from "@/db/schema";
import {
  deleteObjectById,
  getAllObjectsFromCategorys,
} from "@/service/objects";
import { ThemeColor, ThemeMode, ThemeStyle } from "@/utility/styling";
import AntDesign from "@expo/vector-icons/AntDesign";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import React, { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

type CategoryScreenProps = {
  category: string;
};

export default function CategoryScreen() {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  const params: CategoryScreenProps = useGlobalSearchParams();
  const category = params.category;
  const [searchQuery, setSearchQuery] = useState("");
  const [objects, setObjects] = useState<ObjectEntity[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (category) {
        const objectsFromCategory = getAllObjectsFromCategorys(db, category);
        if (objectsFromCategory) setObjects(objectsFromCategory);
      }
      setSelectedItems([]);
    }, [category])
  );

  const deleteCallback = () => {
    selectedItems.forEach((id) => {
      const succ = deleteObjectById(db, id);
      if (succ) {
        objects.length <= 1 && router.push("/");
        setObjects((prev) => prev.filter((o) => o.id !== id));
      }
    });

    setSelectedItems([]);
  };

  const longPressCallback = (object: ObjectEntity) => {
    if (object && object.id && !selectedItems.includes(object.id))
      setSelectedItems((prev) => [...prev, object.id as number]);
    else setSelectedItems((prev) => prev.filter((id) => id !== object.id));
  };

  return (
    <View style={styling.UsableScreen}>
      <AlertBox />
      <Text style={styling.TextHeader}>{category}</Text>
      <ScrollView contentContainerStyle={{ flex: 1, gap: 10 }}>
        {objects.map(
          (object) =>
            object.id !== undefined && (
              <Pressable
                key={object.id}
                onPress={() => {
                  if (selectedItems.length > 0) longPressCallback(object);
                  else
                    router.push({
                      pathname: "/details",
                      params: { detailId: object.id },
                    });
                }}
                onLongPress={() => longPressCallback(object)}
                style={{
                  padding: 5,
                  flexDirection: "row",
                  gap: 20,
                  backgroundColor: selectedItems.includes(object.id)
                    ? theme.glass
                    : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                }}
              >
                <Image
                  key={object.url}
                  style={styling.ImageContainer}
                  source={{ uri: object.url }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    flex: 1,
                    gap: 5,
                    paddingVertical: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{object.name}</Text>
                    <View style={{ flexDirection: "row" }}>
                      <AntDesign
                        style={{}}
                        name="star"
                        size={10}
                        color="orange"
                      />
                      <Text>{`${object.rating}`}</Text>
                    </View>
                  </View>
                  <TagGroup tagGroup={object.tags} />
                </View>
              </Pressable>
            )
        )}
      </ScrollView>
      {selectedItems.length > 0 && (
        <View>
          <Button
            color={theme.button}
            text={"Remove"}
            callback={deleteCallback}
          />
        </View>
      )}
    </View>
  );
}
