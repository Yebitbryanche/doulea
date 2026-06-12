import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

interface FAQTileProps {
  question: string;
  answer: string;
  isDark: boolean;
}

const HelpSupport = () => {
  const { isDark } = useTheme();

  const SUPPORT_EMAIL = 'support@doulea.com';

  // Clean phone number for dialing
  const SUPPORT_PHONE = '+237671355671';

  // Display version
  const DISPLAY_PHONE = '+237 671 35 56 71';

  const handleEmailPress = async () => {
    try {
      await Linking.openURL(
        `mailto:${SUPPORT_EMAIL}?subject=Douleia Support Request`
      );
    } catch (error) {
      console.log('Unable to open email app', error);
    }
  };

  const handlePhonePress = async () => {
    try {
      await Linking.openURL(`tel:${SUPPORT_PHONE}`);
    } catch (error) {
      console.log('Unable to open dialer', error);
    }
  };

  return (
    <SafeAreaView className={isDark ? 'flex-1 bg-white' : 'flex-1 bg-back'}>
      {/* Header */}
      <View
        className={
          isDark
            ? 'p-4 bg-white border-b border-gray-100 flex-row justify-between items-center shadow-sm'
            : 'p-4 bg-dark border-b border-gray-700 flex-row justify-between items-center shadow-sm'
        }
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <Ionicons name="chevron-back" size={22} color="#1F2937" />
        </TouchableOpacity>

        <Text
          className={`font-extrabold text-xl tracking-tight ${
            isDark ? 'text-gray-900' : 'text-white'
          }`}
        >
          Help & Support
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4"
      >
        {/* Intro Banner */}
        <View className="bg-primary p-6 rounded-2xl mb-6 shadow-md shadow-indigo-100 relative overflow-hidden">
          <View className="z-10 relative pr-12">
            <Text className="text-white font-black text-2xl mb-1">
              How can we help?
            </Text>

            <Text className="text-indigo-100 text-sm font-medium leading-5">
              Have questions about your account, verified job postings, or
              applications? Our team is here for you.
            </Text>
          </View>

          <View className="absolute right-[-10] bottom-[-10] opacity-10 rotate-12">
            <MaterialCommunityIcons
              name="comment-question"
              size={140}
              color="white"
            />
          </View>
        </View>

        {/* Contact Channels */}
        <Text
          className={`font-bold text-lg mb-3 ${
            isDark ? 'text-gray-800' : 'text-white'
          }`}
        >
          Direct Assistance
        </Text>

        <View className="flex-row justify-between mb-6">
          {/* Email */}
          <TouchableOpacity
            onPress={handleEmailPress}
            className={isDark?"w-[48%] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-center":"w-[48%] bg-dark p-5 rounded-2xl border border-gray-800 shadow-sm items-center"}
          >
            <View className="p-3 bg-primary/10 rounded-2xl mb-3">
              <Feather name="mail" size={24} color="#2563EB" />
            </View>

            <Text className={isDark?"font-bold text-gray-900 text-sm mb-1":"font-bold text-gray-400 text-sm mb-1"}>
              Email Support
            </Text>

            <Text
              className="text-gray-400 text-xs text-center font-medium"
              numberOfLines={1}
            >
              {SUPPORT_EMAIL}
            </Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            onPress={handlePhonePress}
            className={isDark?"w-[48%] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-center":"w-[48%] bg-dark p-5 rounded-2xl border border-gray-800 shadow-sm items-center"}
          >
            <View className="p-3 bg-emerald-50 rounded-2xl mb-3">
              <Feather name="phone" size={24} color="#10B981" />
            </View>

            <Text className={isDark?"font-bold text-gray-900 text-sm mb-1":"font-bold text-gray-400 text-sm mb-1"}>
              Call Hotline
            </Text>

            <Text
              className="text-gray-400 text-xs text-center font-medium"
              numberOfLines={1}
            >
              {DISPLAY_PHONE}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Header */}
        <View className="flex-row justify-between items-center mb-3">
          <Text
            className={`font-bold text-lg ${
              isDark ? 'text-gray-800' : 'text-white'
            }`}
          >
            Frequently Asked Questions
          </Text>

          <TouchableOpacity>
            <Text className="text-xs font-bold text-indigo-600">
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Items */}
        <View className="gap-y-3 mb-8">
          <FAQTile
            isDark={isDark}
            question="How do I verify my employer account?"
            answer="To verify your business profile, go to Profile Settings > Verification and upload a valid business registry document. Review takes up to 24 hours."
          />

          <FAQTile
            isDark={isDark}
            question="Is it free to list job recommendations?"
            answer="Basic job listings are completely free. Premium visibility options and advanced candidate match analytics can be added optionally."
          />

          <FAQTile
            isDark={isDark}
            question="Why was my job posting rejected?"
            answer="Job postings must align with our safety guidelines. Ensure your description clearly outlines responsibilities and includes verifiable contact information."
          />
        </View>

        {/* Footer */}
        <View
          className={`items-center justify-center py-4 rounded-xl mb-6 border ${
            isDark
              ? 'bg-gray-50 border-gray-100'
              : 'bg-dark border-gray-700'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isDark ? 'text-gray-500' : 'text-gray-300'
            }`}
          >
            Douleia Support Platform v1.0.0
          </Text>

          <Text
            className={`text-[10px] mt-0.5 ${
              isDark ? 'text-gray-400' : 'text-gray-400'
            }`}
          >
            Available Mon - Fri, 8:00 AM - 5:00 PM
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FAQTile = ({
  question,
  answer,
  isDark,
}: FAQTileProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsOpen(!isOpen)}
      className={`p-4 rounded-xl border shadow-sm ${
        isDark
          ? 'bg-white border-gray-100'
          : 'bg-dark border-gray-700'
      }`}
    >
      <View className="flex-row justify-between items-center">
        <Text
          className={`font-semibold text-sm flex-1 pr-4 ${
            isDark ? 'text-gray-800' : 'text-white'
          }`}
        >
          {question}
        </Text>

        <Feather
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={isDark ? '#6B7280' : '#D1D5DB'}
        />
      </View>

      {isOpen && (
        <Text
          className={`text-xs mt-3 leading-relaxed pt-2 border-t ${
            isDark
              ? 'text-gray-500 border-gray-50'
              : 'text-gray-300 border-gray-700'
          }`}
        >
          {answer}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default HelpSupport;