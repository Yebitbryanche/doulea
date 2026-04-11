import React from 'react';
import { View, Text, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const dashboard = () => {
  const {user} = useAuth()
  return (
    <SafeAreaView style={{backgroundColor:"white", flex:1}}>
        <View className="bg-white px-5 py-6 flex-row items-center gap-x-4">
          <Image
            className="w-16 h-16 rounded-full"
            source={
              user?.profile_URL
                ? { uri: user.profile_URL }
                : require("../../assets/images/mailbox.png")
            }
          />
          <View>
            <Text className="text-lg font-bold text-gray-800">
              {user?.user_name || "User"}
            </Text>
            <Text className="text-gray-400 text-sm">{user?.email}</Text>
            {user?.is_verified?
              <View className='flex flex-row gap-x-2 items-center py-1'>
                  <Octicons name='verified' size={10} color={'#5677E8'}/>
                  <Text className='text-xs font-bold text-[#5677E8]'>Verified</Text>
              </View>:
              <View className='flex flex-row gap-x-2 items-center py-1'>
                  <Octicons name='unverified' size={10} color={'#cb1931'}/>
                  <Text className='text-xs font-bold text-[#cb1931]'>Not Verified</Text>
              </View>
            }
          </View>
        </View>
        <View className='flex flex-row items-center justify-between p-5 gap-x-3'>
          <View className='flex-1 bg-primary rounded-xl p-2 flex-col gap-y-5'>
            <View className='inset w-[70px] h-[40px] bg-secondary/50 absolute rounded-br-full'></View>
            <Text className='text-3xl font-bold text-white'>75</Text>
            <Feather name='star' color={'#2563EB'} className='absolute top-2 right-2 bg-white p-1 rounded-md'/>
              <View className='flex flex-row justify-between items-center'>
              <Text className='text-xs text-white font-light'>Doulea</Text>
              <Text className='text-xs text-white font-black'>Ratings</Text>
            </View>
          </View>
          <View className='flex-1 bg-primary rounded-xl p-2 flex-col gap-y-5'>
            <View className='inset w-[70px] h-[40px] bg-secondary/50 absolute rounded-br-full'></View>
            <Text className='text-3xl font-bold text-white'>39</Text>
            <Feather name='list' color={'#2563EB'} className='absolute top-2 right-2 bg-white p-1 rounded-md'/>
            <View className='flex flex-row justify-between items-center'>
              <Text className='text-xs text-white font-light'>Doulea</Text>
              <Text className='text-xs text-white font-black'>Listings</Text>
            </View>
          </View>
        </View>
        <View className='bg-primary rounded-xl p-2 flex-col gap-y-10 mx-5 my-3'>
          <View className='inset w-[100px] h-[50px] bg-secondary/50 absolute rounded-br-full'></View>
          <Text className='text-3xl font-bold text-white'>39</Text>
          <Feather name='list' color={'#2563EB'} className='absolute top-2 right-2 bg-white p-1 rounded-md'/>
          <View className='flex flex-row justify-between items-center'>
            <Text className='text-xs text-white font-light'>Doulea</Text>
            <Text className='text-xs text-white font-black'>Listings</Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

export default dashboard;
