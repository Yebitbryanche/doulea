import { Stack } from "expo-router";
import "./global.css"
import { AuthProvider } from "./context/AuthContext";
import { UploadImageProvider } from "./context/Uploadcontext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <UploadImageProvider>
        <Stack screenOptions={{headerShown:false}} />
      </UploadImageProvider>
    </AuthProvider>
  )
}
