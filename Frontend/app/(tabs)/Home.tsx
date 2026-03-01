import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterButton from '@/components/Buttons/RgisterButton';
import InputField from '@/components/Input/InputField';
import JobCard from '@/components/Cards/JobCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

const Home = () => {
    const [employerVerified, SetEmployerVerified] = useState(false)
  return (
    <SafeAreaView className='flex flex-col items-center'>
      <View className='w-full flex flex-col items-center'>
        <JobCard title='UI/UX Designer' 
        time='2hours ago'
        description='Ntarenkon credit union is pleased to announce to interested with be needing accountant.Lorem Ipsium dolor must always show up sorry. '
        categories={['Tech','Finance','Data']}
        payment={25000}
        setverified={true}
        employer_verified='Verified'
        employer_name='C-Enterprise'
        Saveicon={<Fontisto name='favorite' size={20}/>}
        Likeicon={<MaterialIcons name='favorite' size={20}/>}
        />
      </View>
    </SafeAreaView>
  );
}

export default Home;
