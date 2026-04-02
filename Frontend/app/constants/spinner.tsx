import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const LoadingScreen = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-1 bg-white justify-center items-center">
      
      {/* 🔥 LOGO */}
      <Animated.View style={animatedStyle}>
        <Image
          source={require("../../assets/images/icon.png")} // replace with your logo
          className="w-24 h-24 mb-4"
          resizeMode="contain"
        />
      </Animated.View>

      {/* 🧠 APP NAME */}
      <Text className="text-xl font-bold text-gray-800">
        Job Finder
      </Text>

      {/* ⏳ LOADING TEXT */}
      <Text className="text-gray-400 mt-2">
        Finding opportunities for you...
      </Text>

      {/* 🔄 SPINNER */}
      <View className="mt-6">
        <View className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
      </View>
    </View>
  );
};

export default LoadingScreen;