import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const {isDark} = useTheme()

  return (
    <SafeAreaView className={isDark?"flex-1 bg-white px-3":"flex-1 bg-back px-3"}>
      {/* Header Bar */}
      <View className={isDark?'p-4 bg-white border-b border-gray-100 flex-row justify-between items-center shadow-sm':'p-4 bg-dark flex-row justify-between items-center shadow-sm'}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className={isDark?'w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100':'w-10 h-10 bg-back rounded-full items-center justify-center border border-slate-800'}
        >
          {isDark?<Ionicons name='chevron-back' size={22} color={'#1F2937'} />:<Ionicons name='chevron-back' size={22} color={'#d4d6db'} />}
        </TouchableOpacity>
        <Text className={isDark?'font-extrabold text-xl text-gray-900 tracking-tight':'font-extrabold text-xl text-gray-100 tracking-tight'}>Dashboard</Text>
        <TouchableOpacity           className={isDark?'w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100':'w-10 h-10 bg-back rounded-full items-center justify-center border border-slate-800'}>
          {isDark?<Feather name='bell' size={18} color={'#1F2937'} />:<Feather name='bell' size={18} color={'#d4d6db'} onPress={() => router.push('/(tabs)/Notifications')} />}
        </TouchableOpacity>
      </View>     

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 p-4'>
        {
          user?.role === 'employer'
          ? (
            <View className='gap-y-6 pb-8'>
              
              {/* Profile Card */}
              <View className={isDark?'p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between':'p-4 bg-dark rounded-2xl border border-gray-800 shadow-sm flex-row items-center justify-between'}>
                <View className='flex-row items-center gap-x-4'>
                  <Image 
                    source={{ uri: user?.profile_URL || 'https://via.placeholder.com/150' }} 
                    className='w-16 h-16 rounded-full border-2 border-primary'
                  />
                  <View>
                    <Text className={isDark?'font-bold text-lg text-gray-900':'font-bold text-lg text-gray-100'}>{user?.user_name || 'Welcome Back'}</Text>
                    <View className={isDark?'bg-indigo-50 px-2.5 py-0.5 rounded-full mt-1 self-start':'bg-slate-700 px-2.5 py-0.5 rounded-full mt-1 self-start'}>
                      <Text className={isDark?'text-xs font-semibold text-primary capitalize':'text-xs font-semibold text-gray-100 capitalize'}>{user?.role}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity className='p-2 bg-gray-50 rounded-xl'>
                  <Feather name='edit-3' size={18} color='#2563EB' />
                </TouchableOpacity>
              </View>

              {/* Stats Grid */}
              <Text className={isDark?'font-bold text-gray-800 text-lg mb-1':'font-bold text-gray-100 text-lg mb-1'}>Overview</Text>
              <View className='flex-row justify-between mb-4'>
                <View className={isDark?'w-[48%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm':'w-[48%] bg-dark p-4 rounded-2xl border border-gray-800 shadow-sm'}>
                  <View className={isDark?'p-2 bg-blue-50 rounded-xl self-start mb-2':'p-2 rounded-xl self-start mb-2'}>
                    <BriefcaseIcon />
                  </View>
                  <Text className={isDark?'text-2xl font-black text-gray-900':'text-2xl font-black text-gray-100'}>12</Text>
                  <Text className='text-gray-500 text-xs font-medium mt-0.5'>Active Job Posts</Text>
                </View>

                <View className={isDark?'w-[48%] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm':'w-[48%] bg-dark p-4 rounded-2xl border border-gray-800 shadow-sm'}>
                  <View className={isDark?'p-2 bg-emerald-50 rounded-xl self-start mb-2':'p-2 rounded-xl self-start mb-2'}>
                    <UsersIcon />
                  </View>
                  <Text className={isDark?'text-2xl font-black text-gray-900':'text-2xl font-black text-gray-100'}>48</Text>
                  <Text className='text-gray-500 text-xs font-medium mt-0.5'>Total Applicants</Text>
                </View>
              </View>

              {/* Quick Actions */}
              <Text className={isDark?'font-bold text-gray-800 text-lg mb-1':'font-bold text-gray-100 text-lg mb-1'}>Quick Actions</Text>
              <View className='gap-y-3'>
                <TouchableOpacity className='bg-primary p-4 rounded-xl flex-row items-center justify-center gap-x-2 shadow-md shadow-indigo-200' onPress={()=> router.push('/(tabs)/Upload')}>
                  <Feather name='plus-circle' size={20} color='white' />
                  <Text className='text-white font-bold text-base'>Post a New Job</Text>
                </TouchableOpacity>

                <TouchableOpacity className={isDark?'bg-white border border-gray-200 p-4 rounded-xl flex-row items-center justify-between':'bg-dark border border-gray-800 p-4 rounded-xl flex-row items-center justify-between'}>
                  <View className='flex-row items-center gap-x-3'>
                    <Octicons name='inbox' size={20} color='#4B5563' />
                    <Text className='text-gray-700 font-semibold'>Review Applications</Text>
                  </View>
                  <Feather name='chevron-right' size={18} color='#9CA3AF' />
                </TouchableOpacity>

                <TouchableOpacity className={isDark?'bg-white border border-gray-200 p-4 rounded-xl flex-row items-center justify-between':'bg-dark border border-gray-800 p-4 rounded-xl flex-row items-center justify-between'}>
                  <View className='flex-row items-center gap-x-3'>
                    <Feather name='message-square' size={20} color='#4B5563' />
                    <Text className='text-gray-700 font-semibold'>Candidate Messages</Text>
                  </View>
                  <View className='bg-red-500 px-2 py-0.5 rounded-full'>
                    <Text className='text-white text-xs font-bold'>3</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          ) : (
            /* Candidate / Non-Employer Dashboard View */
            <View className='gap-y-6 pb-8'>
              <View className='p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex-row items-center gap-x-4'>
                <Image 
                  source={{ uri: user?.profile_URL || 'https://via.placeholder.com/150' }} 
                  className='w-16 h-16 rounded-full border-2 border-emerald-500'
                />
                <View>
                  <Text className='font-bold text-lg text-gray-900'>{user?.user_name || 'Hello!'}</Text>
                  <Text className='text-xs font-medium text-gray-500 mt-0.5'>Ready to find your next gig?</Text>
                </View>
              </View>

              {/* Quick Candidate Tracker Placeholder */}
              <View className='bg-emerald-50 border border-emerald-100 p-5 rounded-2xl items-center text-center'>
                <Text className='font-bold text-emerald-800 text-lg mb-1'>Find Jobs Near You</Text>
                <Text className='text-emerald-600 text-xs text-center px-4 mb-4'>Explore hundreds of personalized career opportunities tailored to your skillset.</Text>
                <TouchableOpacity className='bg-emerald-600 px-6 py-3 rounded-xl w-full items-center'>
                  <Text className='text-white font-bold'>Explore Jobs</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick inline custom icon helper functions to avoid cluttering main imports
const BriefcaseIcon = () => <Feather name="briefcase" size={20} color="#3B82F6" />;
const UsersIcon = () => <Feather name="users" size={20} color="#10B981" />;

export default Dashboard;