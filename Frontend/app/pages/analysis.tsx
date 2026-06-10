import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const analysis = () => {
  const handleForgetOnboarding = async () => {
    await AsyncStorage.removeItem('@has_seen_onboarding')
  }
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleForgetOnboarding} className='bg-primary'><Text className='text-white'>reset onboarding</Text></TouchableOpacity>
      <Link href={'/Auth/PushDoc'}>Push doc</Link>
    </SafeAreaView>
  );
}

export default analysis;
