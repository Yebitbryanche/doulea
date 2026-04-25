import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Modal,
  Image,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../apiClient";
import { router } from "expo-router";
import Toast from "@/components/Toast";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import images from "@/types/images";


const Uploads = () => {
  const [title, setTitle] = useState("");
  const {user} = useAuth()
  const {width, height} = Dimensions.get("window")
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [payment, setPayment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const categories = [
    "Finance","Technology","Education","Marketing","Healthcare",
    "Construction","Design","Hospitality","Logistics",
  ];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleUpload = async () => {
    if (!title || !description || !location || !payment || selectedCategories.length === 0) {
      setToastMessage("Please fill all fields");
      setToastType("error");
      setToastVisible(true);
      return;
    }

    try {
      const response = await apiClient.post("/job/upload_job", {
        title,
        description,
        location,
        category: selectedCategories,
        payment: parseFloat(payment),
      });

      const jobID = response.data.Job.id;

      setToastMessage("Upload successful!");
      setToastType("success");
      setToastVisible(true);

      setTimeout(() => {
        router.replace({
          pathname: "/pages/uploadJobCover",
          params: { job_id: jobID },
        });
      }, 1000);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {user?.role ?<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* 🔥 HEADER */}
          <View className="px-5 py-4 bg-white mx-4 rounded-md">
            <Text className="text-2xl font-bold text-gray-800">Post a Job</Text>
            <Text className="text-gray-400 mt-1">
              Fill the details to find the right candidate
            </Text>
          </View>

          {/* 🧾 FORM CARD */}
          <View className="mx-4 mt-4 bg-white p-5 rounded-2xl">
            
            {/* Title */}
            <Text className="font-medium mb-1">Job Title</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3 mb-4"
              placeholder="e.g. Frontend Developer"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <Text className="font-medium mb-1">Description</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3 h-28 mb-4"
              multiline
              textAlignVertical="top"
              placeholder="Describe the job..."
              value={description}
              onChangeText={setDescription}
            />

            {/* Location */}
            <Text className="font-medium mb-1">Location</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3 mb-4"
              placeholder="e.g. Douala"
              value={location}
              onChangeText={setLocation}
            />

            {/* Payment */}
            <Text className="font-medium mb-1">Payment (XAF)</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3 mb-4"
              placeholder="e.g. 150000"
              keyboardType="numeric"
              value={payment}
              onChangeText={setPayment}
            />

            {/* Categories */}
            <Text className="font-medium mb-2">Categories</Text>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="border border-gray-200 rounded-xl p-4"
            >
              {selectedCategories.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {selectedCategories.map((cat, i) => (
                    <View key={i} className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text className="text-primary text-xs">{cat}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-400">Select categories</Text>
              )}
            </TouchableOpacity>
          </View>
          </ScrollView>:
          <View style={{height:height*1}} className="bg-white">
            <View style={{paddingTop:height*0.1}}>
              <Image source={images.soscer} style={{width:width*1, height:height*0.3}} resizeMode="contain"/>
            </View>
            <Text className="flex self-center text-md font-bold text-muted">Sign up as an employer to upload Jobs</Text>
          </View>
        }

        {/* 🚀 STICKY BUTTON */}
        <View className="absolute bottom-0 w-full bg-white px-5 py-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={ user?.role?handleUpload: () => router.push('/Auth/Register')}
            className="bg-primary py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-lg">{user?.role?"Continue":"Register as Employer"}</Text>
          </TouchableOpacity>
        </View>

        {/* 🏷 MODAL */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-5 rounded-t-3xl">
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold">Select Categories</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} />
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap gap-3">
                {categories.map((category) => {
                  const selected = selectedCategories.includes(category);

                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full border ${
                        selected
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      <Text className={selected ? "text-white" : "text-black"}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>

      {/* 🔔 TOAST */}
      <Toast
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Uploads;