import React from 'react';
import { View, Text, Image } from 'react-native';
import { formatedDate } from '../utils/contraints';
import { Feather } from '@expo/vector-icons';

interface Props {
  cover_image_URL: string;
  title: string;
  description: string;
  location: string;
  created_at: string;
  children?: React.ReactNode;
}

const EmployerJobCard = ({
  cover_image_URL,
  title,
  description,
  location,
  created_at,
  children,
}: Props) => {
  return (
    <View
      className="mx-2 my-3 p-3 bg-white rounded-2xl items-center flex-row gap-x-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 0,
        elevation: 2,
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: cover_image_URL }}
        className="w-[90px] h-[90px] rounded-xl"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="flex-1 justify-between">
        
        {/* Top Row */}
        <View className="flex-row justify-between items-start py-2">
          <Text
            numberOfLines={1}
            className="font-bold text-base flex-1 pr-2"
          >
            {title}
          </Text>

          {/* Actions (like/save/etc) */}
          <View className='flex flex-row gap-x-5'>{children}</View>
        </View>

        {/* Description */}
        <Text
          numberOfLines={2}
          className="text-sm text-gray-600 mt-1"
        >
          {description}
        </Text>

        {/* Bottom Row */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs text-gray-500">
            <Feather name='map-pin' size={10} color={'#2563EB'}/> {location}
          </Text>

          <Text className="text-xs text-gray-400">
            {formatedDate(created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EmployerJobCard;