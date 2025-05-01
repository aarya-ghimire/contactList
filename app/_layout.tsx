import { Stack } from "expo-router";
import { useEffect } from "react";
import {
  PaperProvider,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContactProvider } from "../context/ContactContext";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

// Define our custom theme
const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Create our custom theme with proper typing
const CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#5C6BC0", // Indigo
    secondary: "#26A69A", // Teal
    tertiary: "#EC407A", // Pink
    surface: "#FFFFFF",
    background: "#F5F7FA",
    error: "#F44336",
  },
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize empty contacts array if it doesn't exist
    const initializeStorage = async () => {
      try {
        const contacts = await AsyncStorage.getItem("contacts");
        if (contacts === null) {
          await AsyncStorage.setItem("contacts", JSON.stringify([]));
        }
      } catch (error) {
        console.error("Error initializing storage:", error);
      }
    };

    initializeStorage();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={CustomTheme}>
        <SafeAreaProvider>
          <ContactProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: CustomTheme.colors.primary,
                },
                headerTintColor: "#FFFFFF",
                headerTitleStyle: {
                  fontWeight: "600",
                  fontSize: 18,
                },
                headerShadowVisible: false,
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  title: "Contacts",
                  headerLargeTitle: true,
                }}
              />
              <Stack.Screen
                name="contact/new"
                options={{
                  title: "Add Contact",
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="contact/[id]"
                options={{
                  title: "Contact Details",
                  animation: "slide_from_right",
                }}
              />
            </Stack>
            <StatusBar style="light" />
          </ContactProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
