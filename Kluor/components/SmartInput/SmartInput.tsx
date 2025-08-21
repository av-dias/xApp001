import React from "react";
import { GlassTextInput } from "../GlassTextInput/GlassTextInput";
import { View, ScrollView } from "react-native";
import { Button } from "../Button/Button";
import Feather from "@expo/vector-icons/Feather";

import { ThemeMode, ThemeColor } from "@/utility/styling";
const themeMode: ThemeMode = "light";
const theme = ThemeColor(themeMode);

type SmartInputProps = {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  options: string[];
  placeholder: string;
};

type OptionComponentProps = {
  setValue: (value: string) => void;
  options: string[];
  setIsOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const OptionsComponent = ({
  setValue,
  options,
  setIsOptionsVisible,
}: OptionComponentProps) => {
  return (
    <>
      <ScrollView
        horizontal={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        {options.map((option) => (
          <Button
            key={option}
            text={option}
            textStyle={{ fontWeight: "normal", color: theme.textPrimary }}
            callback={() => {
              setValue(option);
              setIsOptionsVisible((prev: boolean) => !prev);
            }}
            color={theme.glass}
          />
        ))}
      </ScrollView>
    </>
  );
};

export const SmartInput = ({
  value,
  setValue,
  placeholder,
  options,
}: SmartInputProps) => {
  const [isOptionsVisible, setIsOptionsVisible] = React.useState(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View style={{ flex: 1 }}>
        {isOptionsVisible ? (
          <OptionsComponent
            setValue={setValue}
            options={options}
            setIsOptionsVisible={setIsOptionsVisible}
          />
        ) : (
          <GlassTextInput
            placeholder={placeholder}
            value={value}
            onChangeCallback={(text) => setValue(text)}
          />
        )}
      </View>
      <Button
        customStyle={{
          height: "100%",
        }}
        text={
          isOptionsVisible ? (
            <Feather name="eye-off" size={16} color="black" />
          ) : (
            <Feather name="eye" size={16} color="black" />
          )
        }
        callback={() => setIsOptionsVisible(!isOptionsVisible)}
      />
    </View>
  );
};
