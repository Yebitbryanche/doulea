import { useTheme } from '@/app/context/ThemeContext';
import React from 'react';
import { View, Text } from 'react-native';

interface HeaderProps {
  text?: string;
}

const RegistrationHeader = ({ text }: HeaderProps) => {
  const {isDark} = useTheme();
  return (
    <View className="px-3 pt-3 pb-4">
      <View className={isDark?"bg-secondary rounded-[30px] p-8 overflow-hidden":"bg-[#1a2e57] rounded-[30px] p-8 overflow-hidden"}>
        
        {/* Decorative Circle */}
        <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10" />

        <Text className="text-primary text-4xl font-black">
          {text}
        </Text>

        <Text className={isDark?"text-gray-500 mt-3 text-base leading-6":"text-gray-300 mt-3 text-base leading-6"}>
          Join thousands of professionals finding their next opportunity.
        </Text>
      </View>
    </View>
  );
};

export default RegistrationHeader;