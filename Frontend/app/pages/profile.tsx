import RegisterButton from '@/components/Buttons/RgisterButton';
import InputField from '@/components/Input/InputField';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
    const [name,setName] = useState()
  return (
    <SafeAreaView className='bg-white'>
        <ScrollView>
        <View className='flex flex-col items-center p-3'>
            <Feather name='chevron-left' size={23} className='absolute left-2 top-4'/>
            <Text className='font-bold text-2xl'>Edit Profile</Text>
            <View className='mt-[5rem]'>
                <Image className="w-[100px] h-[100px] rounded-full" source={require('../../assets/images/favicon.png')}  resizeMode={'contain'}/>
                <Feather name='camera' size={20} color={"white"} className='absolute bottom-0 right-0 bg-primary border-2 border-white p-2 rounded-full'/>
            </View>
            <Text className='text-sm font-semibold my-2'>users Bio and other interesting things about user</Text>
            <Text className='text-sm font-semibold text-blue-500'>Verified</Text>
        </View>
        <View className='flex flex-col items-center gap-y-4 mt-4 p-3'>
            <InputField 
            label='Name'
            placeholder='New Name'
            onChange={() => {}}/>

            <InputField 
            label='Email'
            placeholder='new@gmail.com'
            onChange={() => {}}/>

            <InputField 
            label='Phone'
            placeholder='+237 000 000 000'
            keyboardType='default'
            onChange={() => {}}/>


            <InputField 
            label='Location'
            placeholder='Location'
            onChange={() => {}}/>

            <InputField 
            label='Bio'
            placeholder='tell us about you'
            onChange={() => {}}/>

        </View>
        <View className='flex self-center my-3'>
            <RegisterButton title='Save Edits' onPress={() => {}}/>
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

export default profile;
