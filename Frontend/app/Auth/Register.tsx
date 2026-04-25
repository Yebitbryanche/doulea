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
      setToastMessage('Account created successfully!')
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
      console.log(error)
    }
  }



const handleRegister = () => {
  if(!user_name){
    setToastMessage('Full Name required!')
    setToastType('error')
    setToastVisible(true)
    return
  }

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

  if(!phone){
  setToastMessage('Phone required!')
  setToastType('error')
  setToastVisible(true)
  return
  }

if(!checkEmail(email)){
  setToastMessage('Invalid Email! pleas check and try again avoid spaces as well')
  setToastType('error')
  setToastVisible(true)
  return
}
if(!passwordCheck(password)){
  setToastMessage('Password is weak, try adding numbers and Special Characters: ABcd@#$')
  setToastType('error')
  setToastVisible(true)
  return
}
if(!phonecheck(phone)){
  setToastMessage('Invalid Phone number! pleas check and try again')
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
            <RegistrationHeader text='Get Started!'/>
            <View className='my-[2rem] flex flex-col gap-y-5'>
                <InputField label='Full Name' placeholder='John Doe' keyboardType='default' onChange={setUserName} value={user_name}/>
                <InputField label='Email' placeholder='examplemail@gmail.com' keyboardType='default' onChange={setEmail} value={email.trim()}/>
                <InputField label='Password' secureText={true} keyboardType='default' 
                  showPassword={toggleShowPassword}
                  onToggle={() => setToggleShowPassword(!toggleShowPassword)}
                  icon={toggleShowPassword ? images.shuteye : images.eye}
                  onChange={setPassword}
                  value={password}
                />
                <InputField label='Phone' placeholder=' 670 254 124' keyboardType='phone-pad' inputMode='tel' onChange={setPhone} value={phone}/>
              <View className='flex flex-row items-center'>
                <Checkbox
                  style={{margin: 8,}}
                  value={role}
                  onValueChange={setRole}
                  color={role ? '#2563EB' : undefined}
                />
                <Text> Register as Employer</Text>
              </View> 
                
              <View className='py-[2rem] flex self-center'>
                <RegisterButton title='Register' onPress={handleRegister}/>
              </View>
              <Link href={'/Auth/Login'} className='flex self-center text-primary'>Alread have an account</Link>
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


