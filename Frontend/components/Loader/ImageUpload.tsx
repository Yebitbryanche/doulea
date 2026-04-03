import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

const ImageLoader = () => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide animation (up & down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolations
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -5], // slide up/down
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-15deg", "25deg"],
  });

  return (
    <View className="w-16 h-16 bg-white rounded-md overflow-hidden items-center justify-center">
      
      {/* SLIDING DIAMOND */}
      <Animated.View
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          backgroundColor: "#60A5FA", // lighter blue
          transform: [
            { rotate: "45deg" },
            { translateY },
            { translateX: 10 },
          ],
          shadowColor: "#2563EB",
          shadowOffset: { width: 10, height: -10 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        }}
      />

      {/* ROTATING DOT */}
      <Animated.View
        style={{
          position: "absolute",
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: "#2563EB",
          top: 10,
          left: 10,
          transform: [{ rotate }],
        }}
      />
    </View>
  );
};

export default ImageLoader;