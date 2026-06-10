import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const HelpSupport = () => {
    const {isDark} = useTheme()
  
  // Replace these with your actual contact details or environment variables
  const SUPPORT_EMAIL = "support@doulea.com"; 
  const SUPPORT_PHONE = "+237 671 35 56 71"; // Formatted for your local support reach

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Douleia Support Request`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };

  return (
    <SafeAreaView className={isDark?"flex-1 bg-white":"flex-1 bg-back"}>
      {/* Header */}
      <View className={isDark?'p-4 bg-white border-b border-gray-100 flex-row justify-between items-center shadow-sm':'p-4 bg-dark border-b border-gray-100 flex-row justify-between items-center shadow-sm'}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className='w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100'
        >
          <Ionicons name='chevron-back' size={22} color={'#1F2937'} />
        </TouchableOpacity>
        <Text className='font-extrabold text-xl text-gray-900 tracking-tight'>Help & Support</Text>
        <View className='w-10 h-10' /> {/* Visual balance spacer */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1 p-4'>
        
        {/* Intro Banner */}
        <View className='bg-primary p-6 rounded-2xl mb-6 shadow-md shadow-indigo-100 relative overflow-hidden'>
          <View className='z-10 relative pr-12'>
            <Text className='text-white font-black text-2xl mb-1'>How can we help?</Text>
            <Text className='text-indigo-100 text-sm font-medium leading-5'>
              Have questions about your account, verified job postings, or applications? Our team is here for you.
            </Text>
          </View>
          <View className='absolute right-[-10] bottom-[-10] opacity-10 rotate-12'>
            <MaterialCommunityIcons name="comment-question" size={140} color="white" />
          </View>
        </View>

        {/* Contact Channels Grid */}
        <Text className='font-bold text-gray-800 text-lg mb-3'>Direct Assistance</Text>
        <View className='flex-row justify-between mb-6'>
          
          {/* Email Channel */}
          <TouchableOpacity 
            onPress={handleEmailPress}
            className='w-[48%] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-center'
          >
            <View className='p-3 bg-primary/10 rounded-2xl mb-3'>
              <Feather name='mail' size={24} color='#2563EB' />
            </View>
            <Text className='font-bold text-gray-900 text-sm mb-1'>Email Support</Text>
            <Text className='text-gray-400 text-xs text-center font-medium' numberOfLines={1}>
              {SUPPORT_EMAIL}
            </Text>
          </TouchableOpacity>

          {/* Call Channel */}
          <TouchableOpacity 
            onPress={handlePhonePress}
            className='w-[48%] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-center'
          >
            <View className='p-3 bg-emerald-50 rounded-2xl mb-3'>
              <Feather name='phone' size={24} color='#10B981' />
            </View>
            <Text className='font-bold text-gray-900 text-sm mb-1'>Call Hotline</Text>
            <Text className='text-gray-400 text-xs text-center font-medium' numberOfLines={1}>
              {SUPPORT_PHONE}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View className='flex-row justify-between items-center mb-3'>
          <Text className='font-bold text-gray-800 text-lg'>Frequently Asked Questions</Text>
          <TouchableOpacity>
            <Text className='text-xs font-bold text-indigo-600'>See All</Text>
          </TouchableOpacity>
        </View>

        <View className='gap-y-3 mb-8'>
          <FAQTile 
            question="How do I verify my employer account?" 
            answer="To verify your business profile, go to Profile Settings > Verification, and upload a valid business registry document. Review takes up to 24 hours." 
          />
          <FAQTile 
            question="Is it free to list job recommendations?" 
            answer="Basic job listings are completely free. Premium visibility options and advanced candidate match analytics can be added optionally." 
          />
          <FAQTile 
            question="Why was my job posting rejected?" 
            answer="Job postings must align with our safety guidelines. Ensure your description explicitly outlines responsibilities and features verifiable contact details." 
          />
        </View>

        {/* Footer Note */}
        <View className='items-center justify-center py-4 bg-gray-50 border border-gray-100 rounded-xl mb-6'>
          <Text className='text-xs font-semibold text-gray-500'>Douleia Support Platform v1.0.0</Text>
          <Text className='text-[10px] text-gray-400 mt-0.5'>Available Mon - Fri, 8:00 AM - 5:00 PM</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable clean FAQ Component with toggle indicator layout
const FAQTile = ({ question, answer }:any) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => setIsOpen(!isOpen)}
      className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm'
    >
      <View className='flex-row justify-between items-center'>
        <Text className='font-semibold text-gray-800 text-sm flex-1 pr-4'>{question}</Text>
        <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
      </View>
      {isOpen && (
        <Text className='text-gray-500 text-xs mt-3 leading-relaxed border-t border-gray-50 pt-2'>
          {answer}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default HelpSupport;