import { router, Stack } from "expo-router";
import "./global.css";
import { AuthProvider } from "./context/AuthContext";
import { UploadImageProvider } from "./context/Uploadcontext";
import { LikeProvider } from "./context/LikeContext";
import '@/i18n';
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Instruct the native engine to hold the splash screen layout
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('@has_seen_onboarding');
        if (hasSeenOnboarding === 'true') {
          setShowOnboarding(false);
        }
      } catch (error) {
        console.log('Error checking onboarding flag:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    // Only attempt navigation once routing and state are fully calculated
    if (!isLoading) {
      if (showOnboarding) {
        // Note: Changed from '/pages/Onboarding' to match your Stack.Screen below
        router.replace('/pages/Onboarding'); 
      } else {
        router.replace('/(tabs)/Home');
      }

      //  CRITICAL: Dismiss the splash screen now that navigation has been routed
      SplashScreen.hideAsync().catch((err) => {
        console.warn("Failed to hide splash screen:", err);
      });
    }
  }, [isLoading, showOnboarding]);

  // Clean layout fallback: Don't render anything while the native splash screen is up
  if (isLoading) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <LikeProvider>
          <UploadImageProvider>
            <Stack screenOptions={{ headerShown: false }}>
              {/* Ensure names match your file layout precisely */}
              <Stack.Screen name="Onboarding" />
              <Stack.Screen name="Login" />
              <Stack.Screen name="(tabs)" /> 
            </Stack>
          </UploadImageProvider>
        </LikeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}