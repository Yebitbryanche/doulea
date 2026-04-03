import RegisterButton from '@/components/Buttons/RgisterButton';
import InputField from '@/components/Input/InputField';
import { Feather, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '@/components/requests/requests';
import Toast, { ToastType } from '@/components/Toast';
import DefaultLoader from '@/components/Loader/defaultLoader';
import { router } from 'expo-router';
import { useUpload } from '../context/Uploadcontext';

const profile = () => {
    const {user} = useAuth()
    const [name,setName] = useState<string |undefined>(user?.user_name || "")
    const [email, setEmail] = useState<string |undefined>(user?.email || "");
    const [phone, setPhone] = useState<string | undefined>(user?.phone||'')
    const [location,setLocation] = useState<string | undefined>(user?.address||'')
    const [bio, setBio] = useState<string | undefined>(user?.bio||'')
    const [loading, setLoading] = useState(false)
    const [message,setMessage] = useState('')
    const [type, setType] = useState<ToastType>()
    const [visible, setvisible] = useState(false)
    const {image,uploadImage,pickImage,toastMessage,toastType,toastVisible} = useUpload()

    const handleUploadImage = async () => {
        try{
            setLoading(true)
            await pickImage()
            if(!image){
                setMessage(toastMessage)
                setType(toastType)
                setvisible(toastVisible)
                return;
            }
            await uploadImage(`users/upload_avatar/${user?.id}`)
        }
        catch(error:any){
            console.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    const handleEdit = async () =>{
        try{
            setLoading(true)
            const response = await updateProfile(user?.id,name,email,phone,location,bio)

            if(!name){
                setMessage('Name required');
                setType('error');
                setvisible(true);
                return;
            }
            if(!email){
                setMessage('email required');
                setType('error');
                setvisible(true);
                return;
            }
            if(!phone){
                setMessage('Phone number required');
                setType('error');
                setvisible(true);
                return;
            }
            if(!location){
                setMessage('Name required');
                setType('error');
                setvisible(true);
                return;
            }
            if(!bio){
                setMessage('Name required');
                setType('error');
                setvisible(true);
                return;
            }

            setMessage('profile updated successfully');
            setType('success');
            setvisible(true);

        }
        catch(error:any){
            console.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <SafeAreaView className='bg-white flex-1'>
        <KeyboardAvoidingView
        style={{flex:1}}
        behavior={Platform.OS === 'ios'?'padding':'height'}>
            <ScrollView>
            <View className='flex flex-col items-center p-3'>
                <Feather name='chevron-left' size={23} className='absolute left-2 top-4' onPress={() => router.back()}/>
                <Text className='font-bold text-2xl'>Edit Profile</Text>
                <View className='mt-[3rem]'>
                    <Image className="w-[100px] h-[100px] rounded-full" source={user?.profile_URL?{uri:user?.profile_URL}:require('../../assets/images/favicon.png')}  resizeMode={'contain'}/>
                    <TouchableOpacity  onPress={() => handleUploadImage()} className='absolute bottom-0 right-0 bg-primary border-2 border-white p-2 rounded-full'>
                        <Feather 
                            name='camera' size={20} color={"white"}/>
                    </TouchableOpacity>
                </View>
                <Text className='text-sm font-semibold my-2'>{user?.bio}</Text>
                {user?.is_verified?
                    <View className='flex flex-row gap-x-2 items-center py-3'>
                        <Octicons name='verified' size={15} color={'#5677E8'}/>
                        <Text className='text-sm font-bold text-[#5677E8]'>Verified</Text>
                    </View>:
                    <View className='flex flex-row gap-x-2 items-center py-3'>
                        <Octicons name='unverified' size={15} color={'#cb1931'}/>
                        <Text className='text-sm font-bold text-[#cb1931]'>Not Verified</Text>
                    </View>
                }
                
            </View>
            <View className='flex flex-col items-center gap-y-4 mt-4 p-3'>
                <InputField 
                label='Name'
                value={name}
                placeholder='New Name'
                onChange={(name) => {setName(name)}}/>

                <InputField 
                label='Email'
                value={email}
                placeholder='new@gmail.com'
                onChange={(email) => {setEmail(email)}}/>

                <InputField 
                label='Phone'
                value={phone}
                placeholder='+237 000 000 000'
                keyboardType='default'
                onChange={(phone) => {setPhone(phone)}}/>


                <InputField 
                label='Location'
                value={location}
                placeholder='Location'
                onChange={(location) => {setLocation(location)}}/>

                <InputField
                value={bio}
                label='Bio'
                placeholder='tell us about you'
                onChange={(bio) => {setBio(bio)}}/>

            </View>
            <View className='flex self-center my-3'>
                <RegisterButton title='Save Edits' onPress={handleEdit}/>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
        {loading && <DefaultLoader/>}
        <Toast type={type} visible={visible} message={message} onHide={() => setvisible(false)}/>
    </SafeAreaView>
  );
}

export default profile;
