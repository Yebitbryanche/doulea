import { getUserFav } from "@/components/requests/requests";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { JobDetailProps } from "@/types/other";
import { Image } from "react-native";
import { formatedDate } from "@/components/utils/contraints";
import { Entypo, Ionicons } from "@expo/vector-icons";
import DefaultLoader from "@/components/Loader/defaultLoader";
import images from "@/types/images";

const Favorites = () => {
  const { user } = useAuth();
  const [favs, setFavs] = useState<JobDetailProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getFavs = async () => {
    try {
      setIsLoading(true);
      const response = await getUserFav(user?.id);
      setFavs(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFavs();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      
      {/* 🔥 MODERN HEADER */}
      <View className="px-4 py-4 flex-row items-center justify-between bg-white">
        <View>
          <Text className="text-gray-400 text-sm">Welcome back 👋</Text>
          <Text className="text-xl font-bold text-gray-800">
            Your Favorites
          </Text>
        </View>

        <Image
          className="w-12 h-12 rounded-full"
          source={
            user?.profile_URL
              ? { uri: user.profile_URL }
              : require("../../assets/images/mailbox.png")
          }
        />
      </View>

      {/* 📋 CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {favs.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Image source={images.favorites} className='w-[250px] h-[250px] flex self-center' resizeMode='contain'/>
            <Text className="text-gray-400 mt-4">
              No favorites yet
            </Text>
          </View>
        ) : (
          favs.map((favorite) => (
            <TouchableOpacity
              key={favorite.id}
              activeOpacity={0.8}
              className="mx-4 my-3 bg-white rounded-2xl overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              {/* 🖼 IMAGE */}
              <Image
                className="w-full h-40"
                source={
                  favorite.cover_image_URL && favorite.cover_image_URL !== "null"
                    ? { uri: favorite.cover_image_URL }
                    : require("../../assets/images/defaultImage.png")
                }
                resizeMode={favorite.cover_image_URL && favorite.cover_image_URL !== "null"?"cover":"contain"}
              />

              {/* ❤️ Favorite Icon */}
              <View className="absolute top-3 right-3 bg-white p-2 rounded-full">
                <Ionicons name="heart" size={16} color="#ea306e" />
              </View>

              {/* 🧾 CONTENT */}
              <View className="p-4">
                
                {/* Title */}
                <Text
                  className="text-lg font-bold text-gray-800"
                  numberOfLines={1}
                >
                  {favorite.title}
                </Text>

                {/* Location + Date */}
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <Entypo name="location-pin" size={14} color="#6b7280" />
                    <Text className="text-sm text-gray-500 ml-1">
                      {favorite.location}
                    </Text>
                  </View>

                  <Text className="text-xs text-gray-400">
                    {formatedDate(favorite.created_at)}
                  </Text>
                </View>

                {/* 💰 Payment */}
                <View className="mt-3">
                  <Text className="text-primary font-bold text-base">
                    {favorite.payment} / month
                  </Text>
                </View>

                {/* 🏷 Categories */}
                <View className="flex-row flex-wrap mt-3 gap-2">
                  {favorite.category?.map((cat, index) => (
                    <View
                      key={index}
                      className="bg-primary/10 px-3 py-1 rounded-full"
                    >
                      <Text className="text-primary text-xs">{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ⏳ LOADING */}
      {isLoading && (
        <DefaultLoader/>
      )}
    </SafeAreaView>
  );
};

export default Favorites;