import React, {useState} from 'react';
import { View, Text, Image } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import Octicons from '@expo/vector-icons/Octicons';

const Profile = () => {
    const {user} = useAuth();

    
  return (
    <View className='p-3 bg-primary flex flex-row gap-x-3 items-top m-3 rounded-2xl'>
      <View>
        <Image className='w-[50px] h-[50px] rounded-full' source={user ? { uri: user.profile_URL } : undefined} />
      </View>
      <View>
        <Text className='text-white font-bold text-lg'>{user?.user_name}</Text>
        <Text className='text-md text-secondary'>Tech cooperation lorem ipsium dolor</Text>
        {user?.is_verified?
            <View className='flex flex-row gap-x-2 items-center py-3'>
                <Octicons name='verified' size={15} color={'#5677E8'}/>
                <Text className='text-sm font-bold text-[#5677E8]'>Verified</Text>
            </View>:
            <View className='flex flex-row gap-x-2 items-center py-3'>
                <Octicons name='unverified' size={15} color={'#cb1931'}/>
                <Text className='text-sm font-bold text-[#cb1931]'>Not Verified</Text>
            </View>
            }
      </View>
    </View>
  );
}

export default Profile;
