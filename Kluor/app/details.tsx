import { getObjectById, updateObjectById } from "@/service/objects";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { NewObjectEntity, ObjectEntity } from "@/db/schema";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColor, ThemeMode, ThemeStyle } from "@/utility/styling";
import { TagGroup } from "@/components/TagGroup/TagGroup";
import { ObjectForm } from "@/components/ObjectForm/ObjectForm";
import { Button } from "@/components/Button/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
type DetailsScreenProps = {
  detailId: string;
};

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function DetailsScreen() {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  const params: DetailsScreenProps = useGlobalSearchParams();
  const detailId = Number(params.detailId);

  const [object, setObject] = useState<ObjectEntity | null>(null);
  const [objectEdit, setObjectEdit] = useState<NewObjectEntity | null>(null); // State for object input
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [tag, setTag] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (detailId) {
        const objectDetails = getObjectById(db, detailId);
        console.log("DetailId:", detailId);
        if (objectDetails) {
          setObject(objectDetails);
          setObjectEdit(objectDetails);
        }
      }
    }, [detailId])
  );

  const handleCancel = () => {
    setIsEditing(false);
    setObjectEdit(object);
  };

  const handleUpdate = () => {
    if (
      object &&
      objectEdit &&
      objectEdit.name &&
      objectEdit.category &&
      objectEdit.tags &&
      objectEdit.rating
    ) {
      updateObjectById(db, detailId, objectEdit);
      setObject({
        ...object,
        name: objectEdit.name,
        category: objectEdit.category,
        tags: objectEdit.tags,
        rating: objectEdit.rating,
      }); // Update the displayed object with the edited values
      setIsEditing(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 15, paddingTop: 40, gap: 20 }}>
      <View style={{ gap: 10 }}>
        <Button
          text={
            <Ionicons name="chevron-back-outline" size={24} color="black" />
          }
          paddingHorizontal={10}
          callback={() =>
            router.navigate({
              pathname: "/category",
              params: { category: object?.category },
            })
          }
          customStyle={{
            position: "absolute",
            zIndex: 1,
            top: 10,
            left: 10,
            backgroundColor: styling.PrimaryBtn,
          }}
        />
        <Image
          source={{ uri: object?.url }}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 10,
          }}
        />
        <View style={{ gap: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {`${object?.name} `}
              </Text>
              <Text>{`${object?.category}  `}</Text>
              <AntDesign
                style={{ marginLeft: 15 }}
                name="star"
                size={10}
                color="orange"
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                {object?.rating}
              </Text>
            </Text>
            <Pressable
              onPress={() => setIsEditing(!isEditing)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: theme.button,
                borderRadius: 10,
              }}
            >
              <Text style={styling.TextPrimary}>Edit</Text>
            </Pressable>
          </View>
          {!isEditing && <TagGroup tagGroup={object?.tags} />}
        </View>
      </View>
      {isEditing && (
        <ObjectForm
          objectEdit={objectEdit}
          setObjectEdit={setObjectEdit}
          tag={tag}
          setTag={setTag}
          handleCancel={handleCancel}
          handleUpdate={handleUpdate}
          horizontal={true}
        />
      )}
    </View>
  );
}
