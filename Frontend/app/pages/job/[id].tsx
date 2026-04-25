import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import apiClient from "@/app/apiClient";
import { DetailProp } from "@/types/other";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { timeAgo } from "@/components/utils/contraints";
import { useAuth } from "@/app/context/AuthContext";


const { height } = Dimensions.get("window");

const JobDetails = () => {
  const { id } = useLocalSearchParams();
  const {user} = useAuth()
  const [job, setJob] = useState<DetailProp>();
  const [category, setCategory] = useState<string[]>([]);

  const getJob = async () => {
    try {
      const response = await apiClient.get(`/job/job/${id}`);
      setJob(response.data);
      setCategory(response.data.job.category || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (id) getJob();
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 🔥 HEADER IMAGE */}
        <View className="relative">
          <Image
            source={{uri:job?.job.cover_image_URL}} // replace with job?.job.image if exists
            className="w-full"
            style={{ height: height * 0.35 }}
            resizeMode="cover"
          />

          {/* Overlay buttons */}
          <View className="absolute top-12 left-4 right-4 flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white p-2 rounded-full"
            >
              <Entypo name="chevron-left" size={20} color={'#2563EB'}/>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-2 rounded-full">
              <MaterialIcons name="favorite-border" size={20} color={'#2563EB'}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🧾 CONTENT CARD */}
        <View className="bg-white -mt-6 rounded-t-3xl px-5 pt-6 pb-10">
          
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800">
            {job?.job.title}
          </Text>

          {/* Meta */}
          <View className="flex-row items-center mt-2 gap-x-2">
            <FontAwesome6 name="location-dot" size={14} color={'#2563EB'} />
            <Text className="text-gray-500">{job?.job.location}</Text>
          </View>

          <Text className="text-xs text-gray-400 mt-1">
            Posted {timeAgo(job?.job.created_at?.toString() || "")}
          </Text>

          {/* 💰 Payment */}
          <View className="mt-5">
            <Text className="text-lg font-semibold text-primary">
              {job?.job.payment}/month
            </Text>
          </View>

          {/* 📄 Description */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">Description</Text>
            <Text className="text-gray-600 leading-7">
              {job?.job.description}
            </Text>
          </View>

          {/* 🏷 Categories */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">
              {category.length > 1 ? "Categories" : "Category"}
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {category.map((cat, index) => (
                <View
                  key={index}
                  className="bg-primary/10 px-3 py-1 rounded-full"
                >
                  <Text className="text-primary text-sm">{cat}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 👤 Employer */}
          <TouchableOpacity
            onPress={((job?.job.payment ?? 0) < 20000 || user?.has_paid) ?() =>
              router.push({
                pathname: "/pages/employerProfile",
                params: { id: String(job?.employer.id) },
              }):() => router.push('/pages/transactions/payments')
            }
            className="mt-8 p-4 bg-gray-50 rounded-2xl"
          >
            <Text className="font-bold text-lg mb-2">
              {job?.employer.user_name}
            </Text>

            {((job?.job.payment ?? 0) < 20000 || user?.has_paid) ? (
              <>
                <Text className="text-gray-600">
                  {job?.employer.email}
                </Text>

                <Text className="text-gray-600">
                  {job?.employer.phone}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-gray-600 font-black">
                  {"********" +
                    job?.employer.email.slice(
                      job?.employer.email.length - 10
                    )}
                </Text>

                <Text className="text-gray-600 font-black">
                  {"+237 ****" +
                    job?.employer.phone.slice(
                      job?.employer.phone.length - 4
                    )}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🚀 BOTTOM ACTION BAR */}
      <View className="absolute bottom-0 w-full bg-white px-5 py-4 border-t border-gray-200 flex-row justify-between items-center">
        <View>
          <Text className="font-bold text-primary">
            {job?.job.payment}/month
          </Text>
        </View>

        <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Apply Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default JobDetails;