import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

const Settings = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);

  const Item = ({ icon, label, onPress, right }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-row items-center gap-x-3">
        {icon}
        <Text className="text-gray-800 text-base">{label}</Text>
      </View>
      {right ? right : <Ionicons name="chevron-forward" size={18} color="#999" />}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: any) => (
    <View className="bg-white mx-4 mt-4 rounded-2xl px-4">
      <Text className="text-primary font-black text-sm mt-3">{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 👤 PROFILE HEADER */}
        <View className="bg-white px-5 py-6 flex-row items-center gap-x-4">
          <Image
            className="w-16 h-16 rounded-full"
            source={
              user?.profile_URL
                ? { uri: user.profile_URL }
                : require("../../assets/images/mailbox.png")
            }
          />
          <View>
            <Text className="text-lg font-bold text-gray-800">
              {user?.user_name || "User"}
            </Text>
            <Text className="text-gray-400 text-sm">{user?.email}</Text>
          </View>
        </View>

        {/* 👤 ACCOUNT */}
        <Section title="Account">
          <Item
            icon={<Feather name="user" size={20} />}
            label="Profile"
            onPress={() => router.push("/pages/profile")}
          />
          <Item
            icon={<Ionicons name="language" size={20} />}
            label="Language"
            onPress={() => {}}
          />
          <Item
            icon={<Ionicons name="notifications-outline" size={20} />}
            label="Notifications"
            onPress={() => {}}
          />
        </Section>

        {/* 💼 APP */}
        <Section title="App">
          <Item
            icon={<Ionicons name="grid-outline" size={20} />}
            label="Dashboard"
            onPress={() => router.push("/pages/dashboard")}
          />
          <Item
            icon={<Ionicons name="analytics-outline" size={20} />}
            label="Analytics"
            onPress={() => router.push("/pages/analysis")}
          />
          <Item
            icon={<MaterialIcons name="work-outline" size={20} />}
            label="My Jobs"
            onPress={() => router.push("/pages/myJobs")}
          />
        </Section>

        {/* 💳 PAYMENTS */}
        <Section title="Payments">
          <Item
            icon={<Ionicons name="card-outline" size={20} />}
            label="Payment Methods"
            onPress={() => {}}
          />
          <Item
            icon={<Ionicons name="receipt-outline" size={20} />}
            label="Transactions"
            onPress={() => {}}
          />
        </Section>

        {/* ⚙️ SYSTEM */}
        <Section title="Preferences">
          <Item
            icon={<Ionicons name="moon-outline" size={20} />}
            label="Dark Mode"
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            }
          />
          <Item
            icon={<Ionicons name="help-circle-outline" size={20} />}
            label="Help & Support"
            onPress={() => {}}
          />
        </Section>

        {/* 🚪 LOGOUT */}
        <View className="mx-4 mt-6">
          <TouchableOpacity
            onPress={logout}
            className="bg-red-500 p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;