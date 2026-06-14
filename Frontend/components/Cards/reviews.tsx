import { useTheme } from '@/app/context/ThemeContext';
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
  const {isDark} = useTheme()
  return (
    <View
      className={isDark?"my-3 p-4 bg-white rounded-2xl":"my-3 p-4 bg-back rounded-2xl"}
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
              <Text className={isDark?"font-bold text-base":"font-bold text-gray-100"}>{user_name}</Text>

              {verified && (
                <Feather name="check-circle" size={14} color="#22c55e" />
              )}
            </View>

            <Text className={isDark?"text-gray-500 text-sm":"text-gray-400 text-sm"}>{review}</Text>
          </View>
        </View>

        {/* RIGHT: Rating */}
        <View className="flex-row items-center gap-x-1">
          <Text className={isDark?"font-bold text-sm text-dark":"font-bold text-sm text-gray-200"}>{rating}</Text>
          <FontAwesome name="star" size={14} color="#e6de10" />
        </View>
      </View>

      {/* COMMENT */}
      <View className={isDark?"mt-3 bg-secondary p-3 rounded-xl":"mt-3 bg-dark/50 p-3 rounded-xl"}>
        <Text className={isDark?"text-sm text-gray-700":"text-sm text-gray-300"}>{comment}</Text>
      </View>
    </View>
  );
};

export default Review_card;