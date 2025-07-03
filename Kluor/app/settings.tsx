import { View } from "react-native";

export default function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "90%",
          aspectRatio: 9 / 16,
          backgroundColor: "lightgray",
          borderRadius: 10,
        }}
      ></View>
    </View>
  );
}
