import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/app/context/ThemeContext";

const PaymentOption = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const {isDark} = useTheme();

  const PaymentCard = ({
    title,
    subtitle,
    image,
    value,
  }: {
    title: string;
    subtitle: string;
    image: any;
    value: string;
  }) => {
    const isActive = selected === value;

    return (
      <TouchableOpacity
        onPress={() => setSelected(value)}
        className={`flex-row items-center justify-between p-4 rounded-2xl mb-4 border ${
          isActive
            ? "border-blue-500 bg-blue-50"
            : isDark ? "border-gray-200 bg-white":"border-gray-800 bg-dark"
        }`}
      >
        <View className="flex-row items-center gap-x-3">
          <Image source={image} className="w-12 h-12" resizeMode="contain" />

          <View>
            <Text className={isDark?"font-bold text-base":isActive?"font-bold text-base":"font-bold text-white"}>{title}</Text>
            <Text className="text-gray-500 text-sm">{subtitle}</Text>
          </View>
        </View>

        {isActive && (
          <View className="bg-blue-500 p-1 rounded-full">
            <Feather name="check" size={16} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className={isDark?"flex-1 bg-white px-4":"flex-1 bg-back px-4"}>
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={26} color="#2563EB" />
        </TouchableOpacity>

        <Text className={isDark?"text-xl font-bold ml-3 text-dark":"text-xl font-bold ml-3 text-gray-100"}>Payment Method</Text>
      </View>

      {/* Cards */}
      <Text className="text-gray-500 mb-3">Pay with card</Text>

      <PaymentCard
        title="Visa"
        subtitle="Pay securely with Visa"
        image={require("@/assets/images/visa.png")}
        value="visa"
      />

      <PaymentCard
        title="Mastercard"
        subtitle="Pay securely with Mastercard"
        image={require("@/assets/images/mastercard.png")}
        value="Mastercard"
      />

      {/* Mobile Money */}
      <Text className="text-gray-500 mt-4 mb-3">Mobile Money</Text>

      <PaymentCard
        title="MTN Mobile Money"
        subtitle="Fast & secure payment"
        image={require("@/assets/images/mtn.png")}
        value="Mobile Money"
      />

      <PaymentCard
        title="Orange Money"
        subtitle="Fast & secure payment"
        image={require("@/assets/images/orange.png")}
        value="Orange Money"
      />

      {/* Continue Button */}
      <TouchableOpacity
        disabled={!selected}
        className={`mt-auto mb-6 p-4 rounded-2xl ${
          selected ? "bg-blue-600" : "bg-gray-300"
        }`}
        onPress={() => router.push({pathname:"/pages/payGateway",params:{payment:selected}})}
      >
        <Text className="text-white text-center font-bold text-lg">
          Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentOption;