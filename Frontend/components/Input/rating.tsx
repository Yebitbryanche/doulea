import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  rating: number;
  setRating: (value: number) => void;
};

const Rating = ({ rating, setRating }: Props) => {
  return (
    <View className="flex-row gap-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={28}
            color={star <= rating ? "#facc15" : "#d1d5db"} // yellow / gray
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Rating;