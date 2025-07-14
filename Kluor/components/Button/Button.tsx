import { ThemeColor, ThemeMode, ThemeStyle } from "@/utility/styling";
import { ReactNode } from "react";
import { Pressable, Text } from "react-native";

type ButtonPropsType = {
  text: string | ReactNode;
  color?: string;
  callback: (any: any) => any;
  customStyle?: any;
  paddingHorizontal?: number;
};

export const Button = ({
  text,
  color,
  callback,
  customStyle,
  paddingHorizontal = 15,
}: ButtonPropsType) => {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  return (
    <Pressable
      onPress={callback}
      style={[
        {
          padding: 10,
          paddingHorizontal: paddingHorizontal,
          borderRadius: 10,
          alignItems: "center",
          backgroundColor: color ? color : theme.buttonSecundary,
        },
        customStyle,
      ]}
    >
      <Text style={styling.TextPrimaryTitle}>{text}</Text>
    </Pressable>
  );
};
