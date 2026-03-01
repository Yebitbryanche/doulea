import React from 'react';
import { View, Text } from 'react-native';
interface headerProps{
    text:string
}

const RegistrationHeader = ({text}:headerProps) => {
  return (
    <View className='flex bg-secondary items-center py-9 rounded-bl-3xl rounded-br-3xl shadow-sm w-full'>
      <Text className='text-primary font-bold text-2xl'>{text}</Text>
    </View>
  );
}

export default RegistrationHeader;
