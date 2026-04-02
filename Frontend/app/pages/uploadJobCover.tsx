import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import RegisterButton from "@/components/Buttons/RgisterButton";
import Toast from '@/components/Toast';
import { router, useLocalSearchParams } from "expo-router";
import { useUpload } from "../context/Uploadcontext";
import ImageLoader from "@/components/Loader/ImageUpload";

export default function AddImageScreen() {

  const {job_id} = useLocalSearchParams()
  const {image,pickImage, uploadImage,loading,toastMessage,toastType,toastVisible} = useUpload()



  return (
    <View className="flex-1 bg-white justify-center items-center px-6">

      <Animated.Text
        entering={FadeInDown.duration(600)}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Add Cover Image
      </Animated.Text>

      {/* Image Preview */}
      <Animated.View
        entering={ZoomIn.duration(500)}
        className="w-64 h-64 rounded-2xl bg-gray-100 justify-center items-center overflow-hidden mb-8"
      >
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-gray-400 text-center">
            Image preview will appear here
          </Text>
        )}
      </Animated.View>

      {/* Select Image */}
      <Animated.View entering={FadeIn.delay(200)}>
        <TouchableOpacity onPress={pickImage}><Text>Select Image</Text></TouchableOpacity>
      </Animated.View>

      {/* Upload Button */}
      {image && (
        <Animated.View entering={FadeIn.delay(300)} className="mt-6">
          <RegisterButton title="Upload Image" onPress={() => uploadImage(`job/upload_image/${job_id}`)} />
        </Animated.View>
      )}

      {/* Skip */}
      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/Home")}
        className="mt-5 absolute top-4 right-2"
      >
        <Text className="text-primary">Skip for now</Text>
      </TouchableOpacity>
      <Toast 
      visible={toastVisible}
      type={toastType}
      message={toastMessage}
      onHide={() => !toastVisible} 
      />
      {loading && <ImageLoader/>}
    </View>
  )
}