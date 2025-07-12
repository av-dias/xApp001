import { ObjectForm } from "@/components/ObjectForm/ObjectForm";
import { NewObjectEntity, ObjectEntity } from "@/db/schema";
import { insertOneObject } from "@/service/objects";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library"; // Make sure this is imported
import { router } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | null
  >(null);
  //const [mediaPermission, requestPermission] =
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [object, setObject] = useState<NewObjectEntity | null>(null); // State for object input
  const [newTag, setNewTag] = useState<string | null>("");

  const CUSTOM_ALBUM_NAME = "Kluor"; // 👈 Define your desired folder name here

  useEffect(() => {
    (async () => {
      // 👈 This is where you request Media Library permissions
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === "granted");

      requestPermission();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!permission || !hasMediaLibraryPermission) {
    return null;
  }

  const saveAndUsePicture = async () => {
    if (!uri) {
      Alert.alert("No Photo", "Please take a picture first.");
      return;
    }

    if (!object || !object.name || !object.category || !object.rating) {
      Alert.alert(
        "Please enter details",
        "Please enter details for the photo."
      );
      return;
    }

    if (hasMediaLibraryPermission) {
      try {
        // This is the core line that saves the photo to the camera roll
        const asset = await MediaLibrary.createAssetAsync(uri);

        // After saving, you would typically:
        // 1. Navigate to another screen (e.g., a photo editor, a confirmation page)
        // 2. Pass the `capturedPhotoUri` to a parent component or context for further use
        console.log("Photo is saved and ready to be used:", uri);

        if (asset) {
          // 2. Then, try to create an album and add the asset to it
          let album = await MediaLibrary.getAlbumAsync(CUSTOM_ALBUM_NAME);

          if (album) {
            // Album already exists, add the photo to it
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false); // false to move, true to copy
          } else {
            // Album doesn't exist, create it and add the photo
            album = await MediaLibrary.createAlbumAsync(
              CUSTOM_ALBUM_NAME,
              asset,
              false
            ); // false to move, true to copy
            console.log("Album is created and ready to be used:", album);
          }
        } else {
          Alert.alert("Error", "Failed to create asset from photo.");
        }

        const objectValue: ObjectEntity = {
          name: object.name,
          category: object.category,
          tags: object.tags || [],
          rating: object.rating,
          url: uri, // Use the photo URI as the URL
        };

        insertOneObject(db, objectValue);
        console.log("Object inserted into database:", object);
        setUri(null);
        setObject(null); // Reset object after saving
        router.push("/");
      } catch (e) {
        console.error("Failed to save to media library:", e);
        Alert.alert(
          "Error",
          "Failed to save photo to camera roll. Please check permissions."
        );
      }
    } else {
      Alert.alert(
        "Permission Required",
        "Media Library permission is needed to save the photo. Please enable it in your device settings."
      );
    }
  };

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({ shutterSound: false });
    setUri(photo?.uri ?? null);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleCancel = () => {
    setUri(null);
    setNewTag(null);
  };

  const renderPicture = () => {
    return (
      <View style={styles.saveContainer}>
        <View style={{ width: "60%" }}>
          <Image
            source={typeof uri === "string" ? { uri } : undefined}
            contentFit="cover"
            style={{
              width: "100%",
              aspectRatio: 9 / 16,
              borderRadius: 10,
            }}
          />
        </View>
        <ObjectForm
          objectEdit={object}
          setObjectEdit={setObject}
          tag={newTag}
          setTag={setNewTag}
          handleCancel={handleCancel}
          handleUpdate={saveAndUsePicture}
          cancelText={"Retry"}
          clear={true}
          horizontal={true}
        />
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={"picture"}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <Pressable style={styles.shutterContainer} onPress={takePicture}>
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View style={styles.shutterBtnInner} />
            </View>
          )}
        </Pressable>
        <View
          style={{
            position: "absolute",
            bottom: 60,
            left: "40%",
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 30,
          }}
        >
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  saveContainer: {
    flex: 1,
    width: "100%",
    padding: 15,
    paddingTop: 50,
    alignItems: "center",
    gap: 20,
  },
  pressableContainer: {
    position: "absolute",
    bottom: 400,
    flexDirection: "row",
    gap: 30,
  },
  pressableAcceptStyle: {
    width: 50,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "lightgreen",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  pressableRedoStyle: {
    width: 50,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    gap: 10,
    zIndex: 1,
  },
  inputRowContainer: {
    height: 50,
    flexDirection: "row",
    gap: 20,
  },
  inputStyle: {
    height: 50,
    width: 150,
    borderRadius: 5,
  },
  inputRateStyle: {
    height: 50,
    width: 80,
    borderRadius: 5,
  },
  shutterContainer: {
    zIndex: 1,
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
