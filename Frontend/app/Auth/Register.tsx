import RegisterButton from '@/components/Buttons/RgisterButton';
import RegistrationHeader from '@/components/Header/RegistrationHeader';
import InputField from '@/components/Input/InputField';
import images from '@/types/images';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from 'expo-checkbox';
import Toast from '@/components/Toast';
import { Link, router } from 'expo-router';
import { checkEmail, passwordCheck, phonecheck } from '@/components/utils/contraints';
import apiClient from '../apiClient';
import { useTranslation } from 'react-i18next';


const Register = () => {
  const [toggleShowPassword, setToggleShowPassword] = useState(false)
  const [password,setPassword] = useState('')
  const [email,setEmail] = useState('')
  const [user_name,setUserName] =useState('')
  const [phone,setPhone] =useState('')
  const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [role, setRole] = useState(false)
  const {t} = useTranslation()

  const write_to_db = async () => {
    try{
      const response = await apiClient
      .post('users/create_user',{
        user_name:user_name.trim(),
        email:email.trim(),
        password,
        phone:phone.trim(),
        role 
      })
      setToastMessage(`${t('Account created successfully')}`)
      setToastType('success')
      setToastVisible(true)

      setUserName("")
      setEmail("")
      setPassword("")
      setPhone("")
      setTimeout(() => {
        if(!role){
        router.replace('/Auth/Login')
      }else{
        router.replace('/Auth/PushDoc')
      }
      },1000)
    }
    catch(error:any){
      console.log(error.response.data)
      setToastMessage(error.response.data.detail)
      setToastType('error')
      setToastVisible(true)
      return
      
    }
  }



const handleRegister = () => {
  if(!user_name){
    setToastMessage(`${t("Full Name required")}`)
    setToastType('error')
    setToastVisible(true)
    return
  }

  if(!email){
  setToastMessage(`${t("email required")}`)
  setToastType('error')
  setToastVisible(true)
  return
  }

  if(!password){
  setToastMessage(`${t("password required")}`)
  setToastType('error')
  setToastVisible(true)
  return
  }

  if(!phone){
  setToastMessage(`${t('Phone required')}`)
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
  setToastMessage(`${t('Password is weak, try adding numbers and Special Characters: ABcd@#$')}`)
  setToastType('error')
  setToastVisible(true)
  return
}
if(!phonecheck(phone)){
  setToastMessage(`${t('Invalid Phone number! pleas check and try again')}`)
  setToastType('error')
  setToastVisible(true)
  return
}



write_to_db()

}

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView 
        style={{flex:1}}
        behavior={Platform.OS === "ios"?"padding":"height"}
      >
        <ScrollView>
          <View className='flex flex-col items-center'>
            <RegistrationHeader text={t('get started')+"!"}/>
            <View className='my-[2rem] flex flex-col gap-y-5'>
                <InputField label={t('Full Name')} placeholder='John Doe' keyboardType='default' onChange={setUserName} value={user_name}/>
                <InputField label={t('Email')} placeholder='examplemail@gmail.com' keyboardType='default' onChange={setEmail} value={email.trim()}/>
                <InputField label={t('password')} secureText={true} keyboardType='default' 
                  showPassword={toggleShowPassword}
                  onToggle={() => setToggleShowPassword(!toggleShowPassword)}
                  icon={toggleShowPassword ? images.shuteye : images.eye}
                  onChange={setPassword}
                  value={password}
                />
                <InputField label={t('Phone')} placeholder=' 670 254 124' keyboardType='phone-pad' inputMode='tel' onChange={setPhone} value={phone}/>
              <View className='flex flex-row items-center'>
                <Checkbox
                  style={{margin: 8,}}
                  value={role}
                  onValueChange={setRole}
                  color={role ? '#2563EB' : undefined}
                />
                <Text> {t("register as employer")}</Text>
              </View> 
                
              <View className='py-[2rem] flex self-center'>
                <RegisterButton title={t('Register')} onPress={handleRegister}/>
              </View>
              <Link href={'/Auth/Login'} className='flex self-center text-primary'>{t("Alread have an account")}</Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast
      type={toastType}
      message={toastMessage}
      visible={toastVisible}
      onHide={() => setToastVisible(false)}/>
    </SafeAreaView>
  );
}

export default Register;


