import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { Text, Animated } from "react-native";

type ToastType = "success" | "error" | "info";

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
      className={`absolute w-[94%] bottom-12 self-center px-5 py-3 flex flex-row gap-x-5 rounded-lg z-50 ${colors[type]}`}
    >
        {type === 'error'? <Text><FontAwesome name="warning" size={23} color={'white'}/></Text>:
        type === 'success'?<Text><FontAwesome name="check" size={23} color={'white'}/></Text>:
        <Text><FontAwesome name="info" size={23} color={'white'}/></Text>}
      <Text className="text-white text-md">{message}</Text>
    </Animated.View>
  );
};

export default Toast;
