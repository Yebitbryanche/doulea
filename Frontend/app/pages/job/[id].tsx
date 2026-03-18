import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '@/app/apiClient';

const id = () => {
  const {id} = useLocalSearchParams()
  const [job, setJob] = useState()

  const getJob = async() => {
    try{
      const response = await apiClient.get(`/job/job/${id}`)
      console.log(response.data)
      setJob(response.data)
    }
    catch(error:any){
      console.log(error.message)
    }
  }

  useEffect(() =>{
    if(id){
    getJob()}
  },[id])
  return (
    <View>
      <Text></Text>
    </View>
  );
}

export default id;
