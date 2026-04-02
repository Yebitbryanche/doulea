import React from 'react';
import { View, Text } from 'react-native';
interface headerProps{
    text?:string
}

const RegistrationHeader = ({text}:headerProps) => {
  return (
    <View className='flex bg-secondary items-center py-9 rounded-3xl rounded-br-3xl w-[94%] shadow-sm'>
      <Text className='text-primary font-bold text-2xl'>{text}</Text>
    </View>
  );
}

export default RegistrationHeader;
