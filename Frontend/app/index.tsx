import { Link, router } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap:3,
        alignItems: "center",
      }}
    >
      <Text className="text-green-400" onPress={() => router.push('/(tabs)/Home')}>Edit app/index.tsx to edit this screen.</Text>
      <Link href={'/Auth/Register'}>Register</Link>
      <Link href={'/Auth/Login'}>Login</Link>
      <Link href={'/Auth/PushDoc'}>Upload ID</Link>
    </View>
  );
}
