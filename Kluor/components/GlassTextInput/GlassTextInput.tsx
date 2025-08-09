import { StyleProp, TextInput, TextStyle } from "react-native";
import { styles } from "./style";
import { ThemeColor, ThemeMode } from "@/utility/styling";

type GlassTextInputPropsType = {
  value: number | string | undefined | null;
  onChangeCallback: (any?: any) => void;
  onSubmitEditing?: (any?: any) => void;
  onBlurCallback?: (any?: any) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric";
  style?: StyleProp<TextStyle>;
};

export const GlassTextInput = ({
  value,
  onChangeCallback,
  onSubmitEditing,
  onBlurCallback,
  placeholder,
  keyboardType = "default",
  style,
}: GlassTextInputPropsType) => {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  return (
    <TextInput
      value={value?.toString()}
      onChangeText={onChangeCallback}
      onSubmitEditing={() => onSubmitEditing && onSubmitEditing()}
      onBlur={() => onBlurCallback && onBlurCallback()}
      style={[
        styles.TextInputStyle,
        { backgroundColor: theme.glass, color: theme.textPrimary },
        style,
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.textSecundary}
      returnKeyType="default"
      submitBehavior="submit"
      keyboardType={keyboardType}
    />
  );
};
