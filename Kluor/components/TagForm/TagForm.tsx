import { View } from "react-native";
import { GlassTextInput } from "../GlassTextInput/GlassTextInput";

type TagFormPropsType = {
  value: string | undefined | null;
  onChangeTextCallback: (any: any) => void;
  onPressCallback: (any: any) => void;
};

export const TagForm = ({
  value,
  onChangeTextCallback,
  onPressCallback,
}: TagFormPropsType) => {
  return (
    <View style={{ flexDirection: "row", gap: 5 }}>
      <GlassTextInput
        style={{ flex: 1 }}
        value={value}
        onChangeCallback={onChangeTextCallback}
        onSubmitEditing={onPressCallback}
        placeholder={"Press enter to add multiple Tags"}
      />
    </View>
  );
};
