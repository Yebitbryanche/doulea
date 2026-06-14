import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { Text, Animated } from "react-native";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  
  type?: ToastType;
  visible: boolean;
  duration?: number;
  onHide: () => void;
}

const colors = {
  success: "bg-green-400",
  error: "bg-red-600",
  info: "bg-blue-600",
};

const Toast = ({
  message,
  type = "info",
  visible,
  duration = 3000,
  onHide,
}: ToastProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className={`absolute w-[95%] top-12 self-center px-3 py-5 flex flex-row gap-x-5 rounded-lg z-50 ${colors[type]}`}
    >
        {type === 'error'? <Text><Ionicons name="warning-outline" size={23} color={'white'}/></Text>:
        type === 'success'?<Text><Ionicons name="checkmark-circle-outline" size={23} color={'white'}/></Text>:
        <Text><Ionicons name="information-circle-outline" size={23} color={'white'}/></Text>}
      <Text className="text-white text-sm">{message}</Text>
    </Animated.View>
  );
};

export default Toast;
