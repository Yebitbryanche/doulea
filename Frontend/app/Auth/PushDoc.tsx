import RegisterButton from '@/components/Buttons/RgisterButton';
import images from '@/types/images';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import * as DocumentPicker from "expo-document-picker"
import { View, ScrollView, KeyboardAvoidingView, Platform, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from '@/components/Toast';

const PushDoc = () => {
    const [documentPicked,setDocumentPicked] = useState(false)
    const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')


  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.assets || result.assets.length === 0) {
      return false;
    }

    setDocumentPicked(true);
    return true;
  };

  const upload_document = () => {
    if(!documentPicked){
        setToastMessage('you must upload a document to proceed')
        setToastType('error')
        setToastVisible(true)
        return
    }

        setToastMessage('Document uploaded successfully')
        setToastType('success')
        setToastVisible(true)
        return
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <KeyboardAvoidingView
           style={{flex:1}}
           behavior={Platform.OS === "ios"?"padding":"height"}>
            <ScrollView>
                <View className='p-3'>
                    <Entypo name='chevron-left' size={23} color={'#235347'} onPress={() => router.replace('/Auth/Register')}/>
                </View>
            <View className='flex flex-col items-center gap-y-[6rem] py-[3rem] px-5'>
                <Image source={images.mailbox1} className='h-[20rem] w-[20rem] object-contain'/>
                <View className='flex flex-col gap-y-[2rem]'>
                    <TouchableOpacity className=' flex self-center' onPress={pickDocument}><Text className='text-primary  font-bold'>Select Document</Text></TouchableOpacity>
                    <Text className='text-lg text-center'>To Proceed as an Employer you need to upload some identification or document of authorizatioon</Text>
                    <RegisterButton title='Upload' onPress={upload_document}/>
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
}

export default PushDoc;
