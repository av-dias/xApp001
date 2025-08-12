import { Pressable, Text } from "react-native";
import { styles } from "./style";
import { ThemeColor, ThemeMode } from "@/utility/styling";

type TagPropsType = {
  tag: string;
  color?: string;
  onPressCallback?: (any: any) => void;
};

const themeMode: ThemeMode = "light";

export const Tag = ({
  tag,
  color = ThemeColor(themeMode).defaultTag,
  onPressCallback = () => {},
}: TagPropsType) => {
  return (
    <Pressable
      style={[styles.TagContainerStyle, { backgroundColor: color }]}
      onPress={() => onPressCallback && onPressCallback(tag)}
      key={tag}
    >
      <Text style={styles.TagTextStyle}>{`${tag}`}</Text>
    </Pressable>
  );
};
