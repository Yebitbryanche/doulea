import { Stack } from "expo-router";
import "./global.css"
import { AuthProvider } from "./context/AuthContext";
import { UploadImageProvider } from "./context/Uploadcontext";
import { LikeProvider } from "./context/LikeContext";
import '@/i18n'
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LikeProvider>
          <UploadImageProvider>
            <Stack screenOptions={{headerShown:false}} />
          </UploadImageProvider>
        </LikeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
