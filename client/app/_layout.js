import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StackNavigator from "./StackNavigator";
import { AuthProvider } from "../context/AuthContext";
import "expo-router/entry";
import { ModalPortal } from "react-native-modals";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <>
        <AuthProvider>
          <>
            <StackNavigator />
            <ModalPortal />
          </>
        </AuthProvider>
      </>
    </ThemeProvider>
  );
}
