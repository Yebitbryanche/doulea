import { useTheme } from "@/app/context/ThemeContext";
import React, { useEffect, useRef } from "react";
import { View, Animated, Easing ,Text} from "react-native";

const Bar = ({ delay }: { delay: number }) => {
  const height = useRef(new Animated.Value(32)).current;


  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(height, {
          toValue: 40,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(height, {
          toValue: 32,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start(() => animate());
    };

    const timeout = setTimeout(animate, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        width: 8,
        height,
        marginHorizontal: 4,
        backgroundColor: "#076fe5",
        borderRadius: 4,
      }}
    />
  );
};

const DefaultLoader = () => {
  const {isDark} = useTheme()
  return (
    <View className={isDark?"absolute inset-0 justify-center items-center bg-white":"absolute inset-0 justify-center items-center bg-back"}>
      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <Bar delay={0} />
        <Bar delay={150} />
        <Bar delay={300} />
      </View>
      <Text className={isDark?"mt-2 text-dark":"mt-2 text-gray-200"}>Loading...</Text>
    </View>
  );
};

export default DefaultLoader;