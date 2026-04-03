import React, { useEffect, useState } from 'react';
import { View, Text, ListRenderItem,FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard, { CardProps } from '@/components/Cards/JobCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather'
import Fontisto from '@expo/vector-icons/Fontisto';
import apiClient from '../apiClient';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useLike } from '../context/LikeContext';
import images from '@/types/images';


const Home = () => {
    const [loading, setLoading] = useState(false)
    const [jobs, setJobs] = useState<CardProps[]>([])
    const [filteredJobs, setFilteredJobs] = useState<CardProps[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const { toggleLike, isLiked } = useLike()
    const {user} = useAuth()
    const LIMIT = 10;
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
        onPress={() => {
          router.push({
            pathname:"/pages/job/[id]",
            params:{id:String(item.id)}
          })
        }}>
          <JobCard
            id={item.id}
            title={item.title}
            description={item.description}
            payment={item.payment}
            cover_image_URL={item.cover_image_URL}
            category={item.category}
            employer_rating={item.employer_rating}
            employer_name={item.employer?.user_name}
            employer_verified={item.employer?.is_verified}
            created_at={item.created_at}
            Saveicon={<Fontisto name="favorite" size={20} color="#235347" />}
            Likeicon={
              isLiked(item.id)?
                <MaterialIcons 
                  name="favorite" 
                  size={20} color='#ea306e'
                  onPress={() => toggleLike(user?.id, item.id)} />
                :<MaterialIcons 
                  name="favorite-border" 
                  size={20} color={'#2563EB'}
                  onPress={() => toggleLike(user?.id, item.id)}/>}

            />

          </TouchableOpacity>
        
      )
    }

const getJobs = async () => {
  // prevents multiple calls
  if (loading||!hasMore) return;

  try {
    setLoading(true);

    const response = await apiClient.get(`job/get_jobs?limit=${LIMIT}&offset=${offset}`);
    const newjobs = response.data.data;
    console.log(response.data)

    setJobs(prev => [...prev, ...newjobs])
    setFilteredJobs(prev => [...prev, ...newjobs])

    // update offset
    setOffset(prev => prev+LIMIT)

    //check if more data exists
    setHasMore(response.data.pagination.has_more)

  } catch (error:any) {
    console.log(error)
  }
  finally{
    setLoading(false)
  }
}

    useEffect(() =>{
      getJobs()
    },[])

  return (
    <SafeAreaView className='flex flex-1 flex-col bg-white'>
      <View className='flex flex-col items-center'>
        <View className='w-full flex flex-row justify-between p-4 items-center'>
          <Octicons name="gear" size={24} color="#6B7280" onPress={() => {router.push('/pages/Settings')}}/>
          <TextInput
            placeholder='Search'
            placeholderTextColor={'gray'}
            className='border-b-2 border-muted w-[170px]'
            value={searchQuery}
            onChangeText={handleSearch}/>
          <Feather name="search" size={24} color="#6B7280"/>
        </View>
        <FlatList
        contentContainerStyle={{display:"flex", gap:30, padding:10}}
        data={filters}
        renderItem={({item}) =><TouchableOpacity onPress={() => handleFilter(item)}><Text className='text-primary font-bold'>{item}</Text></TouchableOpacity>}
        horizontal
        showsHorizontalScrollIndicator={false}/>
        
      </View>

      <View className=' flex flex-col items-center'>
        {filteredJobs.length === 0?
        <View className='mt-10 flex fleex-col items-center'>
          <Image source={images.no_task} style={{width:200, height:200}}/>
          <Text className='font-bold text-xl text-muted'>No Listings Found </Text>
          <Text className='text-md text-gray-400'>please check your internet connectiion</Text>
        </View>:
        <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator = {false}
        renderItem={renderItem}
        onEndReached={getJobs}
        onEndReachedThreshold={0.5}

        ListFooterComponent={
          loading ? (
            <Text className="text-center py-4">Loading...</Text>
          ) : !hasMore ? (
            <Text className="text-center py-4 mb-[5rem] text-gray-400">
              No more jobs
            </Text>
          ) : null
        }
        />
        }
      </View>
      <View>

      </View>
    </SafeAreaView>
  );
}

export default Home;
