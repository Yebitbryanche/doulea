import RegisterButton from '@/components/Buttons/RgisterButton';
import InputField from '@/components/Input/InputField';
import { Feather, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '@/components/requests/requests';
import Toast, { ToastType } from '@/components/Toast';
import DefaultLoader from '@/components/Loader/defaultLoader';
import { router } from 'expo-router';
import { useUpload } from '../context/Uploadcontext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const { t } = useTranslation();

  const [name, setName] = useState(user?.user_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.address || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setvisible] = useState(false);

  const { uploadImage, pickImage, toastMessage, toastType, toastVisible } =
    useUpload();

  const { isDark } = useTheme();

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const selectedImage = await pickImage();

      if (!selectedImage) return;

      await uploadImage(
        `users/upload_avatar/${user?.id}`,
        selectedImage
      );

      await fetchUser();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);

      if (!name || !email || !phone || !location) {
        setMessage('Please fill all required fields');
        setType('error');
        setvisible(true);
        return;
      }

      await updateProfile(
        user?.id,
        name,
        email,
        phone,
        location,
        bio
      );

      setMessage('Profile updated successfully 🚀');
      setType('success');
      setvisible(true);

      await fetchUser();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={isDark ?'flex-1 bg-gray-50': 'flex-1 bg-back'  }>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View className="bg-blue-600 rounded-b-[30px] px-5 pt-10 pb-10">

            <Feather
              name="chevron-left"
              size={26}
              color="white"
              onPress={() => router.back()}
            />

            <Text className="text-white text-2xl font-bold mt-3 text-center">
              {t('Edit Profile')}
            </Text>

            {/* AVATAR SECTION */}
            <View className="items-center mt-6">

              <View className="relative">
                <Image
                  className="w-24 h-24 rounded-full border-4 border-white"
                  source={
                    user?.profile_URL
                      ? { uri: user.profile_URL }
                      : require('@/assets/images/default_profile.jpg')
                  }
                />

                <TouchableOpacity
                  onPress={handleUploadImage}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full"
                >
                  <Feather name="camera" size={18} color="#2563EB" />
                </TouchableOpacity>
              </View>

              <Text className="text-white mt-3 font-semibold">
                {user?.bio || 'Tell us about yourself'}
              </Text>

              {/* VERIFICATION BADGE */}
              {user?.role === 'employer' && (
                <View className="flex-row items-center mt-2 bg-white/20 px-3 py-1 rounded-full">
                  {user?.is_verified ? (
                    <>
                      <Octicons name="verified" size={14} color="#22c55e" />
                      <Text className="text-green-200 ml-1">
                        Verified Employer
                      </Text>
                    </>
                  ) : (
                    <>
                      <Octicons name="unverified" size={14} color="#f87171" />
                      <Text className="text-red-200 ml-1">
                        Not Verified
                      </Text>
                    </>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* FORM CARD */}
          <View className={isDark?"bg-white rounded-2xl p-5 shadow":"bg-dark rounded-2xl p-5 shadow"}>

            <Text className={isDark?"text-lg font-bold mb-4":"text-lg font-bold text-gray-300 mb-4"}>
              Personal Information
            </Text>

            <View className="flex-col items-center p-2 gap-y-4">

              <InputField
                label={t('Name')}
                value={name}
                placeholder="Enter your name"
                onChange={setName}
              />

              <InputField
                label={t('Email')}
                value={email}
                placeholder="Enter your email"
                onChange={setEmail}
              />

              <InputField
                label={t('Phone')}
                value={phone}
                placeholder="+237 000 000 000"
                onChange={setPhone}
              />

              <InputField
                label={t('Location')}
                value={location}
                placeholder="Your location"
                onChange={setLocation}
              />

              <InputField
                label={t('Bio')}
                value={bio}
                placeholder="Tell employers about you"
                onChange={setBio}
              />
            </View>
          </View>

          {/* SAVE BUTTON */}
          <View className="mt-6 mx-5 mb-10">
            <RegisterButton
              title={t('Save Changes')}
              onPress={handleEdit}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {loading && <DefaultLoader />}

      <Toast
        type={type}
        visible={visible}
        message={message}
        onHide={() => setvisible(false)}
      />
    </SafeAreaView>
  );
};

export default Profile;