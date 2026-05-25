import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { timeAgo } from "../utils/contraints";

interface NotificationCardProps {
  title: string;
  message: string;
  time?: string;
  is_read?:boolean;
  type?:string;
  onClose?: () => void;
  onPress?: () => void;
}

const NotificationCard = ({
  title,
  message,
  time,
  is_read,
  type,
  onClose,
  onPress,
}: NotificationCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white mx-3 my-2 p-4 rounded-3xl border border-gray-100"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      {/* Top Row */}
      <View className="flex-row items-start justify-between">
        
        {/* Left Content */}
        <View className="flex-1 pr-3">
          
          {/* Notification Badge */}
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              {type == "payment"
              ?
              <Ionicons
                name="cash-outline"
                size={20}
                color="#10ac41"
              />            
              :
              <Ionicons
                name="notifications"
                size={20}
                color="#2563EB"
              />}
            </View>

            <View className="ml-3 flex-1">
              <Text
                className="text-gray-900 font-bold text-base"
                numberOfLines={1}
              >
                {title}
              </Text>

              {time && (
                <Text className="text-xs text-gray-400 mt-0.5">
                  {timeAgo(time) }
                </Text>
              )}
            </View>
          </View>

          {/* Message */}
          <Text
            className="text-gray-600 leading-5 text-sm"
            numberOfLines={3}
          >
            {message}
          </Text>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons
            name="close"
            size={16}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>
      {
      !is_read?   
        <Entypo className="absolute right-2 bottom-2" name="dot-single" size={30} color={"#423aed"}/>
        :
        <Entypo className="absolute right-2 bottom-2" name="dot-single" size={30} color={"#878687"}/>
      }
    </TouchableOpacity>
  );
};

export default NotificationCard;