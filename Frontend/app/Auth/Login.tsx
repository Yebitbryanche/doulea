import RegisterButton from '@/components/Buttons/RgisterButton';
import RegistrationHeader from '@/components/Header/RegistrationHeader';
import InputField from '@/components/Input/InputField';
import * as SecureStore from "expo-secure-store";
import images from '@/types/images';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView,Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkEmail, passwordCheck } from '@/components/utils/contraints';
import Toast from '@/components/Toast';
import apiClient from '../apiClient';
import { useAuth } from '../context/AuthContext';
import DefaultLoader from '@/components/Loader/defaultLoader';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [togglePassword, setTogglePassword] = useState(false)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const {fetchUser, loading} = useAuth()
  const {t} = useTranslation()

  const authentictae_user = async () =>{
    try{
        const response = await apiClient.post('/users/signin',{
        email,password}
        )

        const token = response.data.access_token
        
        // save token
        await SecureStore.setItemAsync("userToken", token)
        await fetchUser()

        setToastMessage(`${t('SignUp successful')}`)
        setToastType('success')
        setToastVisible(true)
      
        setEmail("")
        setPassword("")
        setTimeout(() => {
          router.replace('/(tabs)/Home')
        },1000)
        console.log(response.data)
    }
    catch(error:any){
      console.log(error.response.data)
      setToastMessage(error.response.data.detail)
      setToastType('error')
      setToastVisible(true)
      return
    }
  }

  const handle_Login = () => {
    if(!email){
      setToastMessage('email required!')
      setToastType('error')
      setToastVisible(true)
      return
    }

    if(!password){
      setToastMessage('password required!')
      setToastType('error')
      setToastVisible(true)
      return
    }

    

    if(!checkEmail(email)){
      setToastMessage(`${t('Invalid Email! pleas check and try again avoid spaces as well')}`)
      setToastType('error')
      setToastVisible(true)
      return
    }

    if(!passwordCheck(password)){
      setToastMessage(`${t('Password is weak, try adding numbers and Special Characters')}`)
      setToastType('error')
      setToastVisible(true)
      return
    }

    authentictae_user()
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === "ios"?"padding":"height"}
      >
        <ScrollView>
          <View className='flex flex-col items-center'>
          <RegistrationHeader text={t('welcome back')}/>
          <View className='py-[2rem] flex flex-col gap-y-[2rem]'>
              <InputField label={t('email')} placeholder='example@gmail.com' value={email.trim()} onChange={setEmail}/>
              <InputField label={t('password')} 
              showPassword={togglePassword} 
              onToggle={() => setTogglePassword(!togglePassword)} 
              onChange={setPassword}
              value={password}
              icon={togglePassword ? images.shuteye : images.eye}
              secureText={true}/>
          </View>
          <View className='mt-[2rem]'>
            <RegisterButton title={t('Login')} onPress={handle_Login}/>
          </View>
          <Link href={'/Auth/Register'} className='py-[2rem] text-primary'>{t("Create account instead")}</Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && <DefaultLoader/>}
      <Toast 
      visible={toastVisible}
      type={toastType}
      message={toastMessage}
      onHide={() => setToastVisible(false)} 
      />
    </SafeAreaView>
  );
}

export default Login;
