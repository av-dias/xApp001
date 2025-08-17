import { ScrollView } from "react-native";
import { Tag } from "../Tag/Tag";
import { styles } from "./style";

type TagGroupPropsType = {
  tagGroup: string[] | undefined;
  color?: string;
  onPressCallback?: (any?: any) => void;
  horizontal?: boolean;
};

export const TagGroup = ({
  tagGroup,
  color = undefined,
  onPressCallback,
  horizontal = false,
}: TagGroupPropsType) => {
  return (
    <ScrollView
      horizontal={horizontal}
      contentContainerStyle={styles.tagGroupContainerStyle}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {tagGroup?.map(
        (tag, index) =>
          tag.trim() !== "" && (
            <Tag
              key={index}
              tag={tag}
              color={color}
              onPressCallback={(tag) => onPressCallback && onPressCallback(tag)}
            />
          )
      )}
    </ScrollView>
  );
};
