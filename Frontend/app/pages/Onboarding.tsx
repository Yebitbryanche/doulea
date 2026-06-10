import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Discover Jobs That Match You',
    description:
      'Our recommendation engine analyzes your skills and interests to suggest opportunities you are most likely to succeed in.',
    icon: 'search',
    primary: '#4F46E5',
  },
  {
    id: '2',
    title: 'Connect With Verified Employers',
    description:
      'Apply confidently to trusted employers and businesses actively searching for talented professionals.',
    icon: 'briefcase',
    primary: '#059669',
  },
  {
    id: '3',
    title: 'Grow Your Career Faster',
    description:
      'Track applications, prepare for interviews, and receive personalized career recommendations.',
    icon: 'trending-up',
    primary: '#2563EB',
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@has_seen_onboarding', 'true');
      router.replace('/Auth/Login');
    } catch (error) {
      console.log('Error saving onboarding state:', error);
      router.replace('/Auth/Login');
    }
  };

  const handleNextPress = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      handleCompleteOnboarding();
    }
  };

  const renderItem = ({ item }: any) => (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center px-8"
    >
      {/* Illustration Section */}
      <View
        style={{
          backgroundColor: item.primary,
        }}
        className="w-72 h-72 rounded-[50px] items-center justify-center shadow-lg"
      >
        {/* Floating Shapes */}
        <View className="absolute top-5 right-5 w-16 h-16 bg-white/20 rounded-2xl" />
        <View className="absolute bottom-8 left-6 w-10 h-10 bg-white/20 rounded-xl" />
        <View className="absolute top-16 left-8 w-6 h-6 bg-white/20 rounded-full" />

        <Feather
          name={item.icon}
          size={90}
          color="white"
        />
      </View>

      {/* Content Card */}
      <View className="bg-white w-full rounded-[32px] p-8 mt-10 shadow-sm">
        <Text className="text-3xl font-black text-gray-900 text-center">
          {item.title}
        </Text>

        <Text className="text-gray-500 text-center mt-4 leading-7 text-base">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-6 pt-2">
        {/* Skip Button */}
        <View className="items-end mb-5">
          <TouchableOpacity
            onPress={handleCompleteOnboarding}
            className="bg-white px-4 py-2 rounded-full shadow-sm"
          >
            <Text className="text-gray-600 font-semibold">
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{
              width: `${
                ((currentIndex + 1) /
                  ONBOARDING_DATA.length) *
                100
              }%`,
              backgroundColor:
                ONBOARDING_DATA[currentIndex].primary,
            }}
            className="h-full rounded-full"
          />
        </View>
      </View>

      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          {
            useNativeDriver: false,
          }
        )}
      />

      {/* Footer */}
      <View className="px-8 pb-10 pt-2 flex-row justify-between items-center">
        {/* Pagination */}
        <View className="flex-row items-center">
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={{
                width:
                  currentIndex === index
                    ? 30
                    : 8,
                backgroundColor:
                  currentIndex === index
                    ? ONBOARDING_DATA[currentIndex]
                        .primary
                    : '#D1D5DB',
              }}
              className="h-2 rounded-full mr-2"
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNextPress}
          style={{
            backgroundColor:
              ONBOARDING_DATA[currentIndex].primary,
          }}
          className="px-8 py-4 rounded-2xl shadow-lg flex-row items-center"
        >
          <Text className="text-white font-bold text-base mr-2">
            {currentIndex ===
            ONBOARDING_DATA.length - 1
              ? 'Get Started'
              : 'Continue'}
          </Text>

          <Feather
            name="arrow-right"
            size={18}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;