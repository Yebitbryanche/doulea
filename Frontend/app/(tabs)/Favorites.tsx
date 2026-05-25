import { getUserFav } from "@/components/requests/requests";
import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, useWindowDimensions, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { JobDetailProps } from "@/types/other";
import { Image } from "react-native";
import { formatedDate } from "@/components/utils/contraints";
import { Entypo, Ionicons } from "@expo/vector-icons";
import DefaultLoader from "@/components/Loader/defaultLoader";
import images from "@/types/images";
import { useLike } from "../context/LikeContext";
import { router, useFocusEffect } from "expo-router";


const Favorites = () => {
  const { user, fetchUser } = useAuth();
  const [favs, setFavs] = useState<JobDetailProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {unlike} = useLike()
  const { width } = useWindowDimensions();


  const spacing = 12;
  const numColumns = width > 700 ? 3 : 2;
  const CARD_WIDTH =
    (width - spacing * (numColumns + 1)) / numColumns;


  const getFavs = async () => {
    try {
      setIsLoading(true);
      if(!user?.id) return
      const response = await getUserFav(user?.id);
      setFavs(response);
      fetchUser
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = async (job_id: string) => {
    // remove instantly from UI
    setFavs((prev) => prev.filter((job) => job.id !== job_id));

    // remove from backend
    await unlike(user?.id, job_id);

    // refresh user if needed
    fetchUser();
  };

useFocusEffect(
  useCallback(() => {
    getFavs();
  }, [])
);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        ListHeaderComponent={
          <View className="px-4 py-4 flex-row items-center justify-between bg-white">
            <Image
              className="w-12 h-12 rounded-full"
              source={
                user?.profile_URL
                  ? { uri: user.profile_URL }
                  : require("@/assets/images/default_profile.jpg")
              }
            />
            <View>
              <Text className="text-xl font-bold text-gray-800">
                Your Favorites
              </Text>
            </View>

          </View>}
        data={favs}
        numColumns={numColumns}
        renderItem={({item}) =>
          <TouchableOpacity
            onPress={() => router.push({
              pathname:"/pages/job/[id]",
              params:{id:item.id}
            })}
            key={item.id}
            activeOpacity={0.8}
            className="my-3 bg-white rounded-2xl overflow-hidden relative"
            style={{
              width: CARD_WIDTH,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            {/* 🖼 IMAGE */}
            <Image
              className="w-full h-80"
              source={
                item.cover_image_URL && item.cover_image_URL !== "null"
                  ? { uri: item.cover_image_URL }
                  : require("../../assets/images/defaultImage.png")
              }
              resizeMode={item.cover_image_URL && item.cover_image_URL !== "null"?"cover":"contain"}
            />

            {/* Favorite Icon */}
            <TouchableOpacity 
              onPress={() => handleUnlike(item.id)}
              className="absolute top-3 right-3 bg-white p-2 z-50 rounded-full" >
              <Ionicons name="heart" size={16} color="#ea306e" />
            </TouchableOpacity>

            {/* CONTENT */}
            <View className="inset bg-black/30 absolute h-80 top-0 w-full"/>
            <View className="absolute bottom-1 p-1">
              
              {/* Title */}
              <Text
                className="text-md font-bold text-white"
                numberOfLines={1}
              >
                {item.title}
              </Text>

              {/* Location + Date */}
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-center">
                  <Entypo name="location-pin" size={14} color="#d2d3d4" />
                  <Text className="text-sm text-gray-200 ml-1">
                    {item.location}
                  </Text>
                </View>
              </View>

              {/* 💰 Payment */}
              <View className="mt-3">
                <Text className="text-white text-sm">
                  {item.payment} / month
                </Text>
              </View>

              {/* 🏷 Categories */}
              <View className="flex-row flex-wrap mt-3 gap-2">
                {item.category?.map((cat, index) => (
                  <View
                    key={index}
                    className="bg-white px-3 py-1 rounded-full"
                  >
                    <Text className="text-primary text-xs">{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Image source={images.favorites} className='w-[250px] h-[250px] flex self-center' resizeMode='contain'/>
            <Text className="text-gray-400 mt-4">
              No favorites yet
            </Text>
          </View>
        }
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: spacing,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
      {/* ⏳ LOADING */}
      {isLoading && (
        <DefaultLoader/>
      )}
    </SafeAreaView>
  );
};

export default Favorites;