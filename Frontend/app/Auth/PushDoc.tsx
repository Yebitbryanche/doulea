import RegisterButton from '@/components/Buttons/RgisterButton';
import Toast from '@/components/Toast';
import images from '@/types/images';
import Entypo from '@expo/vector-icons/Entypo';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const PushDoc = () => {
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>(
    'info'
  );
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const {user} = useAuth()

  const sendVerificationEmail = async () => {
    try {
      const email = 'yebitbryanche@gmail.com'; // Replace with your verification email

      const subject = encodeURIComponent(
        'Employer Verification Request'
      );

      const body = encodeURIComponent(`Hello,

I would like to verify my employer account.

Please find attached:

• A valid government-issued ID (National ID, Passport, or Driver's License)
• A clear photo of myself holding the same ID beside my face

Employer Information

Company Name:
Phone Number:
Business Address:

Thank you.`);

      const url = `mailto:${email}?subject=${subject}&body=${body}`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);

        setToastMessage(
          'Email application opened. Please attach your documents before sending.'
        );
        setToastType('success');
        setToastVisible(true);
      } else {
        setToastMessage('Unable to open your email application.');
        setToastType('error');
        setToastVisible(true);
      }
    } catch (error) {
      console.log(error);

      setToastMessage('Something went wrong.');
      setToastType('error');
      setToastVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-3">
            <Entypo
              name="chevron-left"
              size={23}
              color="#2563EB"
              onPress={() => router.back()}
            />
          </View>

          <View className="px-5 py-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Image
                source={images.mailbox1}
                className="h-[15rem] w-[15rem]"
                resizeMode="contain"
              />

              <View className="bg-primary/10 p-5 rounded-full mt-2">
                <Entypo name="shield" size={45} color="#2563EB" />
              </View>

              <Text className="text-2xl font-bold text-center mt-4">
                Verify Your Employer Account
              </Text>

              <Text className="text-center text-gray-500 mt-2">
                Complete verification to start posting jobs and hiring
                candidates on our platform.
              </Text>
            </View>

            {/* Verification Card */}
            <View className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
              <Text className="text-xl font-bold text-center mb-3">
                Identity Verification Required
              </Text>

              <Text className="text-center text-gray-600 mb-6">
                To protect job seekers and prevent fraudulent job postings,
                every employer must complete a quick verification process.
              </Text>

              <View className="gap-y-5">
                <View className="flex-row">
                  <Text className="text-primary font-bold text-lg mr-3">
                    1.
                  </Text>

                  <Text className="flex-1 text-gray-700">
                    Prepare a valid government-issued ID such as a National ID
                    Card, Passport, or Driver's License.
                  </Text>
                </View>

                <View className="flex-row">
                  <Text className="text-primary font-bold text-lg mr-3">
                    2.
                  </Text>

                  <Text className="flex-1 text-gray-700">
                    Take a clear photo of yourself holding the same ID beside
                    your face. Ensure both your face and the ID details are
                    visible.
                  </Text>
                </View>

                <View className="flex-row">
                  <Text className="text-primary font-bold text-lg mr-3">
                    3.
                  </Text>

                  <Text className="flex-1 text-gray-700">
                    Tap the button below to open your email application and send
                    the required documents to our verification team.
                  </Text>
                </View>

                <View className="flex-row">
                  <Text className="text-primary font-bold text-lg mr-3">
                    4.
                  </Text>

                  <Text className="flex-1 text-gray-700">
                    Our team will review your submission and verify your account
                    within 24–48 hours.
                  </Text>
                </View>
              </View>

              {/* Security Notice */}
              <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-6">
                <Text className="text-center text-amber-800 font-medium">
                  Your documents are used only for identity verification and
                  are handled securely.
                </Text>
              </View>
            </View>

            {/* CTA */}
            <View className="mt-8">
              <RegisterButton
                title="Send Verification Email"
                onPress={sendVerificationEmail}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

export default PushDoc;