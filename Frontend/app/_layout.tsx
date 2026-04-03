import { Stack } from "expo-router";
import "./global.css"
import { AuthProvider } from "./context/AuthContext";
import { UploadImageProvider } from "./context/Uploadcontext";
import { LikeProvider } from "./context/LikeContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LikeProvider>
        <UploadImageProvider>
          <Stack screenOptions={{headerShown:false}} />
        </UploadImageProvider>
      </LikeProvider>
    </AuthProvider>
  )
}
