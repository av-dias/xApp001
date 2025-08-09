import { ThemeColor, ThemeMode, ThemeStyle } from "@/utility/styling";
import { ReactNode } from "react";
import { Pressable, StyleProp, Text, TextStyle } from "react-native";

type ButtonPropsType = {
  text: string | ReactNode;
  color?: string;
  textStyle?: StyleProp<TextStyle>;
  callback: (any: any) => any;
  customStyle?: any;
  paddingHorizontal?: number;
  paddingVertical?: number;
};

export const Button = ({
  text,
  color,
  textStyle,
  callback,
  customStyle,
  paddingHorizontal = 15,
  paddingVertical = 10,
}: ButtonPropsType) => {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  return (
    <Pressable
      onPress={callback}
      style={[
        {
          padding: paddingVertical,
          paddingHorizontal: paddingHorizontal,
          borderRadius: 10,
          alignItems: "center",
          backgroundColor: color ? color : theme.buttonSecundary,
        },
        customStyle,
      ]}
    >
      <Text style={[styling.TextPrimaryTitle, textStyle]}>{text}</Text>
    </Pressable>
  );
};
