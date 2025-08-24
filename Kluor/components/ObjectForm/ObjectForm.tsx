import { View, Pressable, Text } from "react-native";
import { GlassTextInput } from "../GlassTextInput/GlassTextInput";
import { TagForm } from "../TagForm/TagForm";
import { TagGroup } from "../TagGroup/TagGroup";
import { NewObjectEntity } from "@/db/schema";
import { ThemeMode, ThemeColor, ThemeStyle } from "@/utility/styling";
import { styles } from "./style";
import Slider from "@react-native-community/slider";
import { SmartInput } from "../SmartInput/SmartInput";
import { Dispatch, SetStateAction } from "react";

type ObjectFormPropsType = {
  objectEdit: NewObjectEntity | null;
  setObjectEdit: React.Dispatch<React.SetStateAction<NewObjectEntity | null>>;
  tag: string | null;
  setTag: React.Dispatch<React.SetStateAction<string | null>>;
  handleCancel: (any: any) => void;
  handleUpdate: (any: any) => void;
  cancelText?: string;
  clear?: boolean;
  horizontal?: boolean;
  options: string[];
};

const validateRate = (
  rate: number | undefined,
  setObjectEdit: Dispatch<SetStateAction<NewObjectEntity | null>>
) => {
  if (rate === undefined || rate === null || isNaN(rate)) {
    setObjectEdit((prev) => ({ ...prev, rating: 5 }));
  } else if (rate < 0) {
    setObjectEdit((prev) => ({ ...prev, rating: 0 }));
  } else if (rate > 10) {
    setObjectEdit((prev) => ({ ...prev, rating: 10 }));
  }
};

export const ObjectForm = ({
  objectEdit,
  setObjectEdit,
  tag,
  setTag,
  handleCancel,
  handleUpdate,
  cancelText = "Cancel",
  clear = false,
  horizontal,
  options,
}: ObjectFormPropsType) => {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  const handleClear = () => {
    setObjectEdit(null);
    setTag(null);
  };

  // Ensure rating is defined to default value
  if (!objectEdit?.rating) objectEdit = { ...objectEdit, rating: 5 };

  return (
    <View style={styles.inputRowContainer}>
      <GlassTextInput
        placeholder="Name"
        value={objectEdit?.name}
        onChangeCallback={(text) =>
          setObjectEdit({ ...objectEdit, name: text })
        }
      />
      <SmartInput
        value={objectEdit?.category}
        setValue={(text) => setObjectEdit({ ...objectEdit, category: text })}
        options={options}
        placeholder="Category"
      />
      <View style={{ flexDirection: "row", gap: 0, alignItems: "center" }}>
        <GlassTextInput
          style={{ width: 60, textAlign: "center" }}
          placeholder="Rate"
          value={objectEdit?.rating}
          keyboardType="numeric"
          onChangeCallback={(text) =>
            setObjectEdit({ ...objectEdit, rating: Number(text) })
          }
          onBlurCallback={() => validateRate(objectEdit?.rating, setObjectEdit)}
        />
        <View style={{ flex: 1 }}>
          <Slider
            value={objectEdit?.rating}
            onValueChange={(rate) =>
              setObjectEdit({ ...objectEdit, rating: rate })
            }
            thumbTintColor={theme.button}
            minimumTrackTintColor={theme.button}
            minimumValue={0}
            maximumValue={10}
            step={0.5}
          />
        </View>
      </View>
      <TagForm
        value={tag}
        onChangeTextCallback={setTag}
        onPressCallback={() => {
          if (tag) {
            setObjectEdit({
              ...objectEdit,
              tags: [...(objectEdit?.tags || []), tag],
            });
            setTag(""); // Clear the input after adding
          }
        }}
      />
      <TagGroup
        tagGroup={objectEdit?.tags}
        horizontal={horizontal}
        onPressCallback={(tagToRemove) => {
          const updatedTags = objectEdit?.tags?.filter(
            (t) => t !== tagToRemove
          );
          setObjectEdit({
            ...objectEdit,
            tags: updatedTags,
          });
        }}
        color={theme.editTag}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Pressable
            onPress={handleCancel}
            style={{
              padding: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: theme.buttonSecundary,
            }}
          >
            <Text style={styling.TextPrimaryTitle}>{cancelText}</Text>
          </Pressable>
          {clear && (
            <Pressable
              onPress={handleClear}
              style={{
                padding: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: theme.buttonSecundary,
              }}
            >
              <Text style={styling.TextPrimaryTitle}>Clear</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={handleUpdate}
          style={{
            padding: 10,
            paddingHorizontal: 15,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: theme.button,
          }}
        >
          <Text style={styling.TextPrimaryTitle}>Update</Text>
        </Pressable>
      </View>
    </View>
  );
};
