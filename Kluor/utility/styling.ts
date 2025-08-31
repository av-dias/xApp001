import { StyleSheet } from "react-native";

type ColorType = {
  defaultTag: string;
  editTag: string;
  button: string;
  buttonSecundary: string;
  glass: string;
  glassOpac: string;
  textPrimary: string;
  textWhite: string;
  textSecundary: string;
  blackout: string;
};

const color = {
  light: {
    defaultTag: "rgba(73, 118, 156, 0.5)",
    editTag: "rgba(236, 155, 84, 0.9)",
    button: "rgba(12, 138, 242, 0.8)",
    buttonSecundary: "rgba(73, 118, 156, 0.3)",
    glass: "rgba(73, 118, 156, 0.2)",
    glassOpac: "rgb(4, 59, 104)",
    textPrimary: "rgba(24, 54, 80, 1)",
    textWhite: "white",
    textSecundary: "rgba(65, 77, 87, 0.6)",
    blackout: "rgba(65, 77, 87, 0.6)",
  },
  dark: {
    defaultTag: "rgba(73, 118, 156, 0.5)",
    editTag: "rgba(236, 155, 84, 0.9)",
    button: "rgba(12, 138, 242, 0.8)",
    buttonSecundary: "rgba(73, 118, 156, 0.3)",
    glass: "rgba(73, 118, 156, 0.2)",
    glassOpac: "rgba(12, 138, 242, 1)",
    textPrimary: "rgba(24, 54, 80, 1)",
    textWhite: "white",
    textSecundary: "rgba(65, 77, 87, 0.6)",
    blackout: "rgba(65, 77, 87, 0.6)",
  },
};

const styling = (color: ColorType) =>
  StyleSheet.create({
    UsableScreen: { flex: 1, padding: 15, paddingTop: 40, gap: 20 },
    TextPrimary: {
      color: color.textWhite,
    },
    TextPrimaryTitle: {
      color: color.textWhite,
      fontWeight: "bold",
    },
    TextHeader: { fontSize: 18, fontWeight: "bold" },
    ImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    PrimaryBtn: {
      backgroundColor: color.button,
      padding: 15,
      borderRadius: 10,
    },
  });

export type ThemeMode = "dark" | "light";

export const ThemeColor = (mode: ThemeMode) =>
  mode === "light" ? color.light : color.dark;

export const ThemeStyle = (mode: ThemeMode) => styling(ThemeColor(mode));
