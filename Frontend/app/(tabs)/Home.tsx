import React, { useEffect, useState } from 'react';
import { View, Text, ListRenderItem,FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard, { CardProps } from '@/components/Cards/JobCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather'
import Fontisto from '@expo/vector-icons/Fontisto';
import apiClient from '../apiClient';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';


const Home = () => {
    const [employerVerified, SetEmployerVerified] = useState(false)
    const [jobs, setJobs] = useState<CardProps[]>([])
    const [filteredJobs, setFilteredJobs] = useState<CardProps[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const filters = ["Recent", 'Near by',"Popular","Recommended"]


const handleFilter = (filter: string) => {
  let updatedJobs = [...jobs]

  if (filter === "Recent") {
    updatedJobs.sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
  }

  // if (filter === "Popular") {
  //   updatedJobs.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
  // }

  // if (filter === "Recommended") {
  //   updatedJobs = updatedJobs.filter(
  //     (job) => job.category?.includes("Technology")
  //   )
  // }

  // if (filter === "Near by") {
  //   updatedJobs = updatedJobs.filter(
  //     (job) => job.location?.toLowerCase().includes("douala")
  //   )
  // }

  setFilteredJobs(updatedJobs)
}


    // search functionality
    const handleSearch = (query: string) => {
      setSearchQuery(query)

      if (!query) {
        setFilteredJobs(jobs)
        return
      }

      const filtered = jobs.filter((job) =>
        job.title?.toLowerCase().includes(query.toLowerCase()) ||
        // job.location?.toLowerCase().includes(query.toLowerCase()) ||
        job.category?.some(cat =>
          cat.toLowerCase().includes(query.toLowerCase())
        )
      )

      setFilteredJobs(filtered)
    }

    const renderItem:ListRenderItem<CardProps> = ({item}) =>{
      return(
        <TouchableOpacity
        onPress={() => router.push({
          pathname:"/pages/job/[id]",
          params:{id:item.id}
        })}>
          <JobCard
            title={item.title}
            description={item.description}
            payment={item.payment}
            cover_image_URL={item.cover_image_URL}
            category={item.category}
            employer_name={item.employer?.user_name}
            employer_verified={item.employer?.is_verified}
            created_at={item.created_at}
            Saveicon={<Fontisto name="favorite" size={20} color="#235347" />}
            Likeicon={<MaterialIcons name="favorite-border" size={23} color="#235347" />}

            />

          </TouchableOpacity>
        
      )
    }

const getJobs = async () => {
  try {
    const response = await apiClient.get('job/get_jobs')

    setJobs(response.data)
    setFilteredJobs(response.data)

  } catch (error:any) {
    console.log(error)
  }
}

    useEffect(() =>{
      getJobs()
    },[])
  return (
    <SafeAreaView className='flex flex-1 flex-col bg-white'>
      <View className='flex flex-col items-center'>
        <View className='w-full flex flex-row justify-between p-4 items-center'>
          <Octicons name="gear" size={24} color="#235347" />
          <TextInput
            placeholder='Search'
            placeholderTextColor={'gray'}
            className='border-b-2 border-primary w-[170px]'
            value={searchQuery}
            onChangeText={handleSearch}/>
          <Feather name="search" size={24} color="#235347"/>
        </View>
        <FlatList
        contentContainerStyle={{display:"flex", gap:30, padding:10}}
        data={filters}
        renderItem={({item}) =><TouchableOpacity onPress={() => handleFilter(item)}><Text className='text-primary font-bold'>{item}</Text></TouchableOpacity>}
        horizontal
        showsHorizontalScrollIndicator={false}/>
        
      </View>

      <View className=' flex flex-col items-center'>
        <FlatList
        data={filteredJobs}
        showsVerticalScrollIndicator = {false}
        renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

export default Home;
