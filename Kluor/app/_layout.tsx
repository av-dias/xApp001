import { useFonts } from "expo-font";
import { SplashScreen, Tabs } from "expo-router";
import React, { useEffect } from "react";

/* Icons */
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: "Collection",
              headerShown: false,
              tabBarIcon: () => (
                <AntDesign name="home" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              headerShown: false,
              tabBarIcon: () => (
                <Feather name="settings" size={24} color="black" />
              ),
            }}
          />
          <Tabs.Screen
            name="category"
            options={{
              title: "Categories",
              headerShown: false,
              href: null,
            }}
          />
          <Tabs.Screen
            name="details"
            options={{
              title: "Details",
              headerShown: false,
              href: null,
            }}
          />
          <Tabs.Screen
            name="camera"
            options={{
              title: "Camera",
              headerShown: false,
              href: null,
            }}
          />
        </Tabs>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
