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
import { useLike } from "@/app/context/LikeContext";
import * as Linking from "expo-linking";
import DefaultLoader from "@/components/Loader/defaultLoader";
import Toast from "@/components/Toast";
import { useTheme } from "@/app/context/ThemeContext";


const { height } = Dimensions.get("window");

const JobDetails = () => {
  const { id } = useLocalSearchParams();
  const {user} = useAuth()
  const {isDark} = useTheme()
  const [job, setJob] = useState<DetailProp>();
  const [category, setCategory] = useState<string[]>([]);
  const {toggleLike, isLiked} = useLike()
  const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const getJob = async () => {
    try {
      const response = await apiClient.get(`/job/job/${id}`);
      setJob(response.data);
      setCategory(response.data.job.category || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const toggle_like = async () => {
    await toggleLike(user?.id,id.toString())
  }

  useEffect(() => {
    if (id) getJob();
  }, [id]);


  // open email application
const openMail = async () => {
  try {
    setLoading(true);

    if((job?.job.payment ?? 0) > 20000 && !user?.has_paid){

      console.log("make a payment first")
        setToastMessage(`${("applying for jobs with salaries greater than 20,000XAF require that you make a payment of 1500XAF")}`)
        setToastType('info')
        setToastVisible(true) 
        router.push('/pages/transactions/payments')
      return;
    };

    const email = job?.employer.email;

    if (!email) {
      console.log("No employer email");
      return;
    }

    const url = `mailto:${email}?subject=${encodeURIComponent(`Job Application for ${job.job.title}`)}&body=${encodeURIComponent(
      `Hello, I would like to apply for this role`
    )}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open mail app");
    }

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
};

  return (
    <SafeAreaView className={isDark?"flex-1 bg-gray-100":"flex-1 bg-back"}>
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
              className={isDark?"bg-white p-2 rounded-full":"bg-dark p-2 rounded-full"}
            >
              <Entypo name="chevron-left" size={20} color={'#2563EB'}/>
            </TouchableOpacity>

            <TouchableOpacity className={isDark?"bg-white p-2 rounded-full":"bg-dark p-2 rounded-full"} onPress={toggle_like}>
            <MaterialIcons name={!isLiked(id.toString())?"favorite-border":"favorite"} size={20} color={!isLiked(id.toString())?'#2563EB':'#db0658'}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🧾 CONTENT CARD */}
        <View className={isDark?"bg-white -mt-6 rounded-t-3xl px-5 pt-6 pb-10":"bg-dark -mt-6 rounded-t-3xl px-5 pt-6 pb-10"}>
          
          {/* Title */}
          <Text className={isDark?"text-2xl font-bold text-gray-800":"text-2xl font-bold text-white"}>
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
            <Text className={isDark?"text-lg font-semibold mb-2 text-dark":"text-lg font-semibold mb-2 text-white"}>Description</Text>
            <Text className={isDark?"text-gray-600 leading-7":"text-gray-200 leading-7"}>
              {job?.job.description}
            </Text>
          </View>

          {/* 🏷 Categories */}
          <View className="mt-6">
            <Text className={isDark?"text-lg font-semibold mb-2 text-dark":"text-lg font-semibold mb-2 text-white"}>
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

          {/* Employer */}
          <TouchableOpacity
            onPress={((job?.job.payment ?? 0) < 20000 || user?.has_paid) ?() =>
              router.push({
                pathname: "/pages/employerProfile",
                params: { id: String(job?.employer.id) },
              }):() => router.push('/pages/transactions/payments')
            }
            className={isDark?"mt-8 p-4 bg-gray-50 rounded-2xl":"mt-8 p-4 bg-back rounded-2xl"}
          >
            <Text className={isDark?"font-bold text-lg mb-2 text-dark":"font-bold text-lg mb-2 text-white"}>
              {job?.employer.user_name}
            </Text>

            {((job?.job.payment ?? 0) < 20000 || user?.has_paid) ? (
              <>
                <Text className={isDark?"text-gray-600":"text-gray-200"}>
                  {job?.employer.email}
                </Text>

                <Text className={isDark?"text-gray-600":"text-gray-200"}>
                  {job?.employer.phone}
                </Text>
              </>
            ) : (
              <>
                <Text className={isDark?"text-gray-600 font-black":"text-gray-200 font-black"}>
                  {"********" +
                    job?.employer.email.slice(
                      job?.employer.email.length - 10
                    )}
                </Text>

                <Text className={isDark?"text-gray-600 font-black":"text-gray-200 font-black"}>
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
      <View className={isDark?
        "absolute bottom-0 w-full bg-white px-5 py-4 flex-row justify-between items-center":
        "absolute bottom-0 w-full bg-back px-5 py-4 flex-row justify-between items-center"}>
        <View>
          <Text className="font-bold text-primary">
            {job?.job.payment}/month
          </Text>
        </View>

        <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl" onPress={openMail}>
          <Text className="text-white font-bold">Apply Now</Text>
        </TouchableOpacity>
      </View>
      <Toast 
      visible={toastVisible}
      type={toastType}
      message={toastMessage}
      onHide={() => setToastVisible(false)} 
      />
      {loading && <DefaultLoader/>}
    </SafeAreaView>
  );
};

export default JobDetails;