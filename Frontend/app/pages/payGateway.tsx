import RegisterButton from '@/components/Buttons/RgisterButton';
import InputField from '@/components/Input/InputField';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Image, Platform, TextInput, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '@/components/requests/requests';
import DefaultLoader from '@/components/Loader/defaultLoader';

const payGateway = () => {
  const { payment } = useLocalSearchParams();
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const {user} = useAuth()


const Pay_ = async () => {
    try {
        if (!user?.id) {
            console.log("User not loaded")
            return
        }

        if (!amount || amount < 100) {
            console.log("Invalid amount")
            return
        }

        setLoading(true)

        const result = await initiatePayment(user.id, amount)

        if (!result) {
            console.log("Payment failed")
            return
        }

        console.log(result.data)
        await Linking.openURL(result.data.data.authorization_url)


    } catch (error: any) {
        console.error(error.message)
    } finally {
        setLoading(false)
    }
}

  const getImage = () => {
    if (payment === 'Mobile Money') {
      return require('../../assets/images/mtn.png');
    }
    if (payment === 'Orange Money') {
      return require('../../assets/images/orange.png');
    }
    if (payment === 'Mastercard') {
      return require('../../assets/images/mastercard.png');
    }
    return require('@/assets/images/visa.png');
  };

  const getColor = () => {
    if (payment === 'Mobile Money') return 'text-yellow-500';
    if (payment === 'Orange Money') return 'text-orange-600';
    return 'text-blue-600';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 items-center px-3 pt-10">

          {/* HEADER CARD */}
          <View className="w-full bg-white rounded-3xl shadow-md py-6 px-2 items-center">
            
            <Image
              source={getImage()}
              className="w-52 h-32"
              resizeMode="contain"
            />

            <Text className={`mt-4 text-2xl font-bold ${getColor()}`}>
              {payment}
            </Text>

            <Text className="text-gray-500 text-sm mt-1">
              Secure payment gateway
            </Text>
          </View>

          {/* FORM CARD */}
          <View className="w-full bg-white rounded-3xl shadow-md mt-8 p-6">

            <Text className="text-gray-700 font-semibold mb-2">
              Enter amount
            </Text>

            <TextInput
              placeholder="e.g 1000 XAF"
              keyboardType="numeric"
              className="border border-gray-300 border-1 w-full rounded-2xl focus:border-primary/50 focus:border-1 pr-12"
              onChangeText={(text) => setAmount(Number(text))}
            />

            <Text className="text-xs text-gray-400 mt-3">
              Minimum amount may apply depending on provider
            </Text>
          </View>

          {/* BUTTON SECTION */}

        <TouchableOpacity onPress={Pay_} className='mt-10 bg-primary p-4 rounded-xl'>
            <Text className='text-white font-bold'>{`Pay with ${payment}`}</Text>
        </TouchableOpacity>


        </View>
      </KeyboardAvoidingView>
      {loading && <DefaultLoader/>}
    </SafeAreaView>
  );
};

export default payGateway;