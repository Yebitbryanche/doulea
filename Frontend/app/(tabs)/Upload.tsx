import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../apiClient';
import { useAuth } from '../context/AuthContext';
import Profile from '@/components/Header/Profile';
import InputField from '@/components/Input/InputField';
import RegisterButton from '@/components/Buttons/RgisterButton';
import { router } from 'expo-router';
import Toast from '@/components/Toast';

const Uploads = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [payment, setPayment] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const categories = [
  "Finance",
  "Technology",
  "Education",
  "Marketing",
  "Healthcare",
  "Construction",
  "Design",
  "Hospitality",
  "Logistics",
]

const toggleCategory = (category: string) => {
  if (selectedCategories.includes(category)) {
    setSelectedCategories(selectedCategories.filter(c => c !== category))
  } else {
    setSelectedCategories([...selectedCategories, category])
  }
}

const handleUpload = async () => {
  try{
    if(!title){
      setToastMessage('needs a job title to proceed')
      setToastType('error')
      setToastVisible(true)
      return
    }

    if(!description){
      setToastMessage('a job description is required')
      setToastType('error')
      setToastVisible(true)
      return
    }

    if(!location){
      setToastMessage('please enter job location')
      setToastType('error')
      setToastVisible(true)
      return
    }

    if(!payment){
      setToastMessage('payment is required')
      setToastType('error')
      setToastVisible(true)
      return
    }

    if(!selectedCategories){
      setToastMessage('Please select at least one category')
      setToastType('error')
      setToastVisible(true)
      return
    }

    const response = await apiClient.post('/job/upload_job',{
      title,
      description,
      location,
      category:selectedCategories,
      payment:parseFloat(payment)
    })

    const jobID = response.data.Job.id
    console.log('Job id:',jobID)
          setToastMessage('Upload successful!')
          setToastType('success')
          setToastVisible(true)
        
          setTitle("")
          setDescription("")
          setLocation("")
          setPayment("")
          setSelectedCategories([])
          setTimeout(() => {
            router.replace({
              pathname:'/pages/uploadJobCover',
              params:{job_id:jobID}})
          },1000)
    console.log(response.data)
  }
  catch(error:any){
    console.log(error.message)
  }
}


  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS === 'ios'?"padding":"height"}>
        <ScrollView>
          <Profile/>
          <View className='flex flex-col items-center gap-y-5 py-5'>
            <InputField value={title} placeholder='Job title' label='Job Title' onChange={setTitle}/>
            <View>
              <Text className='font-medium'>Job Description</Text>
              <TextInput
              className="border text-md border-gray-300 border-2 w-[320px] h-[100] rounded-2xl focus:border-primary/50 focus:border-2 pr-12"
              multiline
              numberOfLines={4}
              textAlignVertical='top'
              placeholder='Job Description'
              value={description}
              onChangeText={setDescription}
              />
            </View>
            <InputField value={location} placeholder='Location' label='Job Location' onChange={setLocation}/>
            <View>
              <Text className='font-medium'>Payment Amount</Text>
              <TextInput
              className="border text-md border-gray-300 border-2 w-[320px] rounded-2xl focus:border-primary/50 focus:border-2 pr-12"
              placeholder='amount in XAF'
              value={payment}
              keyboardType='numeric'
              onChangeText={setPayment}
              />
            </View>
            <View>
              <Text className="font-medium">Job Categories</Text>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="border border-gray-300 w-[320px] rounded-2xl p-4"
              >
                <Text>
                  {selectedCategories.length > 0
                    ? selectedCategories.join(", ")
                    : "Select Categories"}
                </Text>
              </TouchableOpacity>
            </View>
            <RegisterButton title='Next' onPress={handleUpload}/>
          </View>
        </ScrollView>
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white w-[90%] p-5 rounded-2xl">

              <Text className="text-lg font-bold mb-4">Select Job Categories</Text>

              <View className="flex-row flex-wrap gap-3">

                {categories.map((category) => {
                  const selected = selectedCategories.includes(category)

                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-full border 
                      ${selected ? "bg-primary border-primary" : "border-gray-300"}`}
                    >
                      <Text className={selected ? "text-white" : "text-black"}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  )
                })}

              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mt-5 bg-primary p-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold">Done</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
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

export default Uploads;
