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
      <Text className="bg-gray-300 p-3 rounded-lg my-2" onPress={() => router.push('/(tabs)/Home')}>Edit app/index.tsx to edit this screen.</Text>
      <Link className="bg-gray-300 p-3 rounded-lg my-2" href={'/Auth/Register'}>Register</Link>
      <Link className="bg-gray-300 p-3 rounded-lg my-2" href={'/Auth/Login'}>Login</Link>
      <Link className="bg-gray-300 p-3 rounded-lg my-2" href={'/Auth/PushDoc'}>Upload ID</Link>
      <Link className="bg-gray-300 p-3 rounded-lg my-2" href={'/pages/LanguageSwitch'}>Language switch</Link>

    </View>
  );
}
