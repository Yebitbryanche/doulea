import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { user, logout } = useAuth();
  const {t} = useTranslation()
  const [darkMode, setDarkMode] = React.useState(false);
  const [logoutVisible, setLogoutVisible] = React.useState(false);

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
    <View className="bg-white mx-4 mt-4 rounded-2xl px-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 2,
      }}>
      <Text className="text-primary font-black text-sm mt-3">{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 👤 PROFILE HEADER */}
        <View className="bg-white px-5 py-6 flex-row items-center gap-x-4">
          <Image
            className="w-16 h-16 rounded-full"
            source={
              user?.profile_URL
                ? { uri: user.profile_URL }
                : require("@/assets/images/default_profile.jpg")
            }
          />
          <View>
            <Text className="text-lg font-bold text-gray-800">
              {user?.user_name || "User"}
            </Text>
            <Text className="text-gray-400 text-sm">{user?.email}</Text>
            {user?.is_verified?
              <View className='flex flex-row gap-x-2 items-center py-1'>
                  <Octicons name='verified' size={10} color={'#5677E8'}/>
                  <Text className='text-xs font-bold text-[#5677E8]'>Verified</Text>
              </View>:
              <View className='flex flex-row gap-x-2 items-center py-1'>
                  <Octicons name='unverified' size={10} color={'#cb1931'}/>
                  <Text className='text-xs font-bold text-[#cb1931]'>Not Verified</Text>
              </View>
            }
          </View>
        </View>

        {/* 👤 ACCOUNT */}
        <Section title={t("Account")}>
          <Item
            icon={<Feather name="user" size={20} />}
            label={t("Edit Profile")}
            onPress={() => router.push("/pages/editProfile")}
          />
          <Item
            icon={<Ionicons name="language" size={20} />}
            label={t("Language")}
            onPress={() => router.push("/pages/LanguageSwitch")}
          />
          <Item
            icon={<Ionicons name="notifications-outline" size={20} />}
            label={t("Notifications")}
            onPress={() => router.push("/pages/myPosts")}
          />
        </Section>

        {/* 💼 APP */}
        { user?.role === 'employer' &&
        <Section title={t("App")}>
          <Item
            icon={<Ionicons name="grid-outline" size={20} />}
            label={t("Dashboard")}
            onPress={() => router.push("/pages/dashboard")}
          />
          <Item
            icon={<Ionicons name="analytics-outline" size={20} />}
            label={t("Analytics")}
            onPress={() => router.push("/pages/analysis")}
          />
          <Item
            icon={<MaterialIcons name="work-outline" size={20} />}
            label={t("My Jobs")}
            onPress={() => router.push("/pages/myPosts")}
          />
        </Section>}

        {/* 💳 PAYMENTS */}
        <Section title={t("Payments")}>
          <Item
            icon={<Ionicons name="card-outline" size={20} />}
            label={t("Payment Methods")}
            onPress={() => {router.push('/pages/transactions/payments')}}
          />
          <Item
            icon={<Ionicons name="receipt-outline" size={20} />}
            label={t("Transactions")}
            onPress={() => {router.push('/pages/transactions/transactionDetails')}}
          />
        </Section>

        {/* ⚙️ SYSTEM */}
        <Section title={t("Preferences")}>
          <Item
            icon={<Ionicons name="moon-outline" size={20} />}
            label={t("Dark Mode")}
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            }
          />
          <Item
            icon={<Ionicons name="help-circle-outline" size={20} />}
            label={t("Help & Support")}
            onPress={() => {}}
          />
        </Section>

        {/* 🚪 LOGOUT */} 
        <View className="mx-4 mt-6">
          <TouchableOpacity
            onPress={() => setLogoutVisible(true)}
            className="bg-red-500 p-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold">
              {t("Logout")}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <Modal
      transparent
      visible={logoutVisible}
      animationType="fade"
    >
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          className="bg-white w-[85%] rounded-3xl p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >

          {/* ICON */}
          <View className="items-center mb-4">
            <View className="bg-red-100 p-4 rounded-full">
              <Ionicons
                name="log-out-outline"
                size={32}
                color="#ef4444"
              />
            </View>
          </View>

          {/* TITLE */}
          <Text className="text-xl font-black text-center text-gray-800">
            {t("Logout")}
          </Text>

          {/* MESSAGE */}
          <Text className="text-gray-500 text-center mt-3 leading-6">
            {t("are_you_sure_you_want_to_logout_from_your_account_?")}
          </Text>

          {/* BUTTONS */}
          <View className="flex-row gap-x-3 mt-6">

            {/* CANCEL */}
            <TouchableOpacity
              onPress={() => setLogoutVisible(false)}
              className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
            >
              <Text className="font-bold text-gray-700">
                {t("cancel")}
              </Text>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
              onPress={() => {
                setLogoutVisible(false);
                logout();
              }}
              className="flex-1 bg-red-500 py-4 rounded-2xl items-center"
            >
              <Text className="font-bold text-white">
                {t("Logout")}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;