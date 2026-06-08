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
import { useTheme } from "../context/ThemeContext";


const Uploads = () => {
  const [title, setTitle] = useState("");
  const {user} = useAuth()
  const {width, height} = Dimensions.get("window")
  const {isDark} = useTheme()
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
      console.log(response.data)

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
    <SafeAreaView className={isDark?"flex-1 bg-white":"flex-1 bg-back"}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {user?.role === 'employer' ?<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* 🔥 HEADER */}
          <View className={isDark?"px-5 py-4 bg-white mx-4 rounded-md":"px-5 py-4 bg-dark mx-4 rounded-md"}>
            <Text className={isDark?"text-2xl font-bold text-gray-800":"text-2xl font-bold text-gray-200"}>Post a Job</Text>
            <Text className={isDark?"text-gray-400 mt-1":"text-white mt-1"}>
              Fill the details to find the right candidate
            </Text>
          </View>

          {/* 🧾 FORM CARD */}
          <View className={isDark?"mx-4 mt-4 bg-white p-5 rounded-2xl":"mx-4 mt-4 bg-dark p-5 rounded-2xl"}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 3,
          }}      >
            
            {/* Title */}
            <Text className={isDark?"font-medium mb-1 text-dark":"font-medium mb-1 text-white"}>Job Title</Text>
            <TextInput
              className={isDark?"border border-gray-200 rounded-xl p-3 mb-4 text-dark":"border text-white border-gray-700 rounded-xl p-3 mb-4"}
              placeholder="e.g. Frontend Developer"
              placeholderTextColor={isDark?"#b0b0b0":"#fff"}
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <Text className={isDark?"font-medium mb-1 text-dark":"font-medium mb-1 text-white"}>Description</Text>
            <TextInput
              className={isDark?"border border-gray-200 rounded-xl p-3 h-28 mb-4 text-black":"border border-gray-700 rounded-xl text-white p-3 h-28 mb-4"}
              multiline
              textAlignVertical="top"
              placeholder="Describe the job..."
              placeholderTextColor={isDark?"#b0b0b0":"#fff"}
              value={description}
              onChangeText={setDescription}
            />

            {/* Location */}
            <Text className={isDark?"font-medium mb-1 text-dark":"font-medium mb-1 text-white"}>Location</Text>
            <TextInput
              className={isDark?"border border-gray-200 rounded-xl p-3 mb-4 text-dark":"border text-white border-gray-700 rounded-xl p-3 mb-4"}
              placeholder="e.g. Douala"
              placeholderTextColor={isDark?"#b0b0b0":"#fff"}
              value={location}
              onChangeText={setLocation}
            />

            {/* Payment */}
            <Text className={isDark?"font-medium mb-1 text-dark":"font-medium mb-1 text-white"}>Payment (XAF)</Text>
            <TextInput
              className={isDark?"border border-gray-200 rounded-xl p-3 mb-4 text-dark":"border text-white border-gray-700 rounded-xl p-3 mb-4"}
              placeholder="e.g. 150000"
              placeholderTextColor={isDark?"#b0b0b0":"#fff"}
              keyboardType="numeric"
              value={payment}
              onChangeText={setPayment}
            />

            {/* Categories */}
            <Text className={isDark?"font-medium mb-1 text-dark":"font-medium mb-1 text-white"}>Categories</Text>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className={isDark?"border border-gray-200 rounded-xl p-4":"border border-gray-700 rounded-xl p-4"}
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
        <View className={isDark?"absolute bottom-14 w-full bg-white px-5 border-t border-gray-200":"absolute bottom-14 w-full bg-back px-5"}>
          <TouchableOpacity
            onPress={ user?.role === 'employer'?handleUpload: () => router.push('/Auth/Register')}
            className="bg-primary py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-lg">{user?.role === 'employer'?"Continue":"Register as Employer"}</Text>
          </TouchableOpacity>
        </View>

        {/* 🏷 MODAL */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-end bg-black/40">
            <View className={isDark?"bg-white p-5 rounded-t-3xl":"bg-dark p-5 rounded-t-3xl"}>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className={isDark?"text-lg font-bold text-dark":"text-lg font-bold text-white"}>Select Categories</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  {isDark?<Ionicons name="close" size={24} color={'black'}/>:<Ionicons name="close" size={24} color={'white'}/>}
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
                      <Text className={selected ? "text-white" :isDark ? "text-black": "text-white"}>
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