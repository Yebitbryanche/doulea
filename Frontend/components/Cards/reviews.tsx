import { Feather, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image } from 'react-native';

interface Props {
  image: string;
  user_name: string;
  review: string;
  comment: string;
  rating: number;
  verified?: boolean;
}

const Review_card = ({
  image,
  user_name,
  review,
  comment,
  rating,
  verified,
}: Props) => {
  return (
    <View
      className="my-3 p-4 bg-white rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between">
        
        {/* LEFT: Avatar + Name */}
        <View className="flex-row items-center gap-x-3 flex-1">
          <Image
            source={{uri:image}}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />

          <View className="flex-1">
            <View className="flex-row items-center gap-x-1">
              <Text className="font-bold text-base">{user_name}</Text>

              {verified && (
                <Feather name="check-circle" size={14} color="#22c55e" />
              )}
            </View>

            <Text className="text-gray-500 text-sm">{review}</Text>
          </View>
        </View>

        {/* RIGHT: Rating */}
        <View className="flex-row items-center gap-x-1">
          <Text className="font-bold text-sm">{rating}</Text>
          <FontAwesome name="star" size={14} color="#e6de10" />
        </View>
      </View>

      {/* COMMENT */}
      <View className="mt-3 bg-secondary p-3 rounded-xl">
        <Text className="text-sm text-gray-700">{comment}</Text>
      </View>
    </View>
  );
};

export default Review_card;