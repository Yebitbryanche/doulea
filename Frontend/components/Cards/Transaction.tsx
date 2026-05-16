import React from "react";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { formatedDate } from "../utils/contraints";

type TransactionCardProps = {
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  reference: string;
  method?: string;
};

const TransactionCard = ({
  amount,
  status,
  date,
  reference,
  method,
}: TransactionCardProps) => {
  
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <View
      className="bg-white mx-4 my-2 p-4 rounded-2xl"
      style={{
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
      }}
    >
      {/* Top Section */}
      <View className="flex-row justify-between items-center">
        <View className="flex-col gap-x-3">
          <View className="bg-blue-100 p-3 w-[40px] rounded-full">
            <FontAwesome5
              name="wallet"
              size={18}
              color="#2563EB"
            />
          </View>

          <View>
            <Text className="font-bold text-base text-gray-800">
              {method}
            </Text>
            <Text className="text-gray-900 font-medium text-xs">
              Ref: {reference}
            </Text>
          </View>
        </View>

        <Text className="font-bold text-lg text-primary">
          {amount.toLocaleString()} XAF
        </Text>
      </View>

      {/* Bottom Section */}
      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center gap-x-1">
          <MaterialIcons
            name="access-time"
            size={16}
            color="gray"
          />
          <Text className="text-gray-500 text-sm">
            {formatedDate(date)}
          </Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${getStatusColor()
            .split(" ")[0]}`}
        >
          <Text
            className={`text-xs font-semibold ${getStatusColor()
              .split(" ")[1]}`}
          >
            {status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionCard;