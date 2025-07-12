import { View, Pressable, Text } from "react-native";
import { GlassTextInput } from "../GlassTextInput/GlassTextInput";
import { TagForm } from "../TagForm/TagForm";
import { TagGroup } from "../TagGroup/TagGroup";
import { NewObjectEntity } from "@/db/schema";
import { ThemeMode, ThemeColor, ThemeStyle } from "@/utility/styling";
import { styles } from "./style";

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
}: ObjectFormPropsType) => {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);
  const styling = ThemeStyle(themeMode);

  const handleClear = () => {
    setObjectEdit(null);
    setTag(null);
  };

  return (
    <View style={styles.inputRowContainer}>
      <GlassTextInput
        placeholder="Name"
        value={objectEdit?.name}
        onChangeCallback={(text) =>
          setObjectEdit({ ...objectEdit, name: text })
        }
      />
      <GlassTextInput
        placeholder="Category"
        value={objectEdit?.category}
        onChangeCallback={(text) =>
          setObjectEdit({ ...objectEdit, category: text })
        }
      />
      <GlassTextInput
        placeholder="Rate"
        value={objectEdit?.rating}
        keyboardType="numeric"
        onChangeCallback={(text) =>
          setObjectEdit({ ...objectEdit, rating: Number(text) })
        }
      />
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
