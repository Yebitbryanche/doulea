import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();
  const {isDark} = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en"
  );

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <SafeAreaView className={isDark?"flex-1 bg-[#F8FAF] px-3":"flex-1 bg-back px-3"}>

      {/* Header */}
      <View className="mt-8 px-3 mb-10 flex flex-col items-center">
        {isDark?<Ionicons name='chevron-back' size={22} color={'#1F2937'} className="absolute left-1 top-1" onPress={() => router.back()} />:<Ionicons name='chevron-back' size={22} color={'#dedfe2'} className="absolute left-1 top-1" onPress={() => router.back()}/>}
        <Text className={isDark?"text-3xl font-bold text-gray-900":"text-3xl font-bold text-gray-100"}>
          {t("choose a language")}
        </Text>
        <Text className={isDark?"text-gray-500 text-sm mt-2 text-base":"text-gray-300 text-sm mt-2 text-base"}>
          {t("Select your preferred language for a better experience")}
        </Text>
      </View>

      {/* Language Cards */}
      <View className="gap-y-5">

        {/* English */}
        <TouchableOpacity
          onPress={() => handleLanguageChange("en")}
          className={`p-5 rounded-3xl flex-row items-center justify-between ${
            selectedLanguage === "en"
              ? "bg-blue-500"
              : "bg-white"
          } shadow-sm`}
        >
          <View className="flex-row items-center">
            
            {/* Flag placeholder */}
              <Image
                source={require("@/assets/icons/flag.png")}
                className="w-12 h-12 rounded-full mr-4"
              />

            <View>
              <Text
                className={`text-lg font-semibold ${
                  selectedLanguage === "en"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {t("English")}
              </Text>

              <Text
                className={`text-sm ${
                  selectedLanguage === "en"
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {t("Default language")}
              </Text>
            </View>
          </View>

          {selectedLanguage === "en" && (
            <Text className="text-white text-xl"><Ionicons name="checkmark-circle-outline" size={20}/></Text>
          )}
        </TouchableOpacity>

        {/* French */}
        <TouchableOpacity
          onPress={() => handleLanguageChange("fr")}
          className={`p-5 rounded-3xl flex-row items-center justify-between ${
            selectedLanguage === "fr"
              ? "bg-blue-500"
              : "bg-white"
          } shadow-sm`}
        >
          <View className="flex-row items-center">
            
            {/* Flag placeholder */}
              <Image
                source={require("@/assets/icons/france.png")}
                className="w-12 h-12 rounded-full mr-4"
              />

            <View>
              <Text
                className={`text-lg font-semibold ${
                  selectedLanguage === "fr"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Français
              </Text>

              <Text
                className={`text-sm ${
                  selectedLanguage === "fr"
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                Langue française
              </Text>
            </View>
          </View>

          {selectedLanguage === "fr" && (
            <Text className="text-white text-xl"><Ionicons name="checkmark-circle-outline" size={20}/></Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom note */}
      <View className="mt-auto mb-8">
        <Text className="text-center text-gray-400 text-sm">
          {t("You can change this anytime in settings")}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSwitch;