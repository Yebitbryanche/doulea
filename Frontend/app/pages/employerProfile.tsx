import Review_card from '@/components/Cards/reviews';
import { getReviews, writeReview } from '@/components/requests/requests';
import images from '@/types/images';
import { AntDesign, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import DefaultLoader from '@/components/Loader/defaultLoader';
import { Employer, Review } from '@/types/other';

const myJobs = () => {
  const [isopen,setIsopen] = useState(false)
  const [rating, setRating] = useState(4);
  const [offset, setOffset] = useState(0)
  const limit = 5;
  const [loading, setLoading] = useState(false)
  const [reviews,setReviews] =useState<Review[]>([])
  const [employerDetails, setEmployerDetails] = useState<Employer>()
  const [averageRating, setAverageRating] = useState<number>(0)
  const [totalreviews, setTotalReviews] = useState<number>(0)
  const [review, setReview] = useState('')
  const [comment, setComment] = useState("")
  const {user, fetchUser} = useAuth()
  const {id} = useLocalSearchParams();

  const commentArray = ["Poor","Average","Good","Excellent"]

  const handleOpen = () => {
    setIsopen(true)
  }

  const handleClose = () => {
    setIsopen(false)
  }

  const postReview = async() => {
    try{
      setLoading(true)
      const user_id = user?.id
      const response = await writeReview(user_id,rating, review, comment, id)
      fetchUser()
    }
    catch(error:any){
      console.error(error.message)
    }
    finally
    {
      setLoading(false)
      setIsopen(false)
    }
  }

  // fetch employer rating for employer with local params id
  const fetch_reviews = async () => {
    try{
      const response = await getReviews(id,offset, limit)
      console.log(response)
      setReviews(response.reviews)
      setEmployerDetails(response.employer)
      setAverageRating(response.average_rating)
      setTotalReviews(response.total_reviews)
    }
    catch(error:any){
      console.error(error.message)
    }
  }

  useEffect(()=>{
    fetch_reviews()
  },[id])



  return (
<SafeAreaView className="flex-1 p-4 bg-white">
  <View className="flex-1 flex-col gap-y-6">

    {/* PROFILE CARD */}
    <View className="items-center rounded-3xl p-3 bg-secondary">
      <Image source={{uri:employerDetails?.avatar}} style={{ width: 80, height: 80 }} className='border-white border-4 rounded-full'/>
      <Text className="font-black">{employerDetails?.name}</Text>
      <Text className="text-medium">{employerDetails?.bio}</Text>

      <View className="flex-row bg-white rounded-3xl items-center gap-x-5 my-4 p-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}>
        <View className="bg-secondary h-[60px] w-[60px] rounded-xl items-center justify-center">
          <FontAwesome5 name="telegram-plane" size={24} color={'#2563EB'} />
          <Text className='text-xs font-black text-primary'>Contact</Text>
        </View>
        <View className="bg-secondary h-[60px] w-[60px] rounded-xl items-center justify-center">
          {/* <FontAwesome name="star" size={24} color={'#2563EB'} /> */}
          <Text className='text-xl font-black text-primary'>{averageRating}</Text>
          <Text className='text-xs font-black text-primary'>Ratings</Text>
        </View>
        <View className="bg-secondary h-[60px] w-[60px] rounded-xl items-center justify-center">
          {/* <FontAwesome5 name="list" size={24} color={'#2563EB'} /> */}
          <Text className='text-xl font-black text-primary'>{totalreviews}</Text>
          <Text className='text-xs font-black text-primary'>Reviews</Text>
        </View>
      </View>
    </View>

    {/** review input modal */}
  {
    isopen && (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios"?'padding':'height'}
        style={{flex:1}}>
        
        <View className="absolute inset-0 z-50 justify-end bg-black/30">
          {/* BOTTOM SHEET */}
          <View className="bg-white rounded-t-3xl p-5">
            <AntDesign onPress={handleClose} name="close" size={20} color="#000000" className='absolute right-3 top-3'/>


            {/* HANDLE */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-3" />

            {/* TITLE */}
            <Text className="text-center font-bold text-lg mb-4">
              Leave a Review
            </Text>

            {/* QUESTION */}
            <Text className="text-center font-semibold text-base">
              Say Something about the Employer?
            </Text>
            <Text className="text-center text-gray-500 text-sm mb-3">
              Please give your ratings & add your review
            </Text>

            {/* STARS */}
            <View className="flex-row justify-center mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Feather
                    name="star"
                    size={28}
                    color={i <= rating ? "#facc15" : "#d1d5db"}
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* INPUT */}
            <View className="bg-gray-100 rounded-xl px-3 py-2 flex-row items-center mb-5">
              <TextInput
                placeholder="Write your experience..."
                className="flex-1 text-sm"
                multiline
                onChangeText={(text) => setReview(text)}
              />
              {/* <Feather name="image" size={18} color="#6b7280" /> */}
            </View>
            <View className="flex flex-row gap-x-2 justify-center p-3 flex-wrap">
              {commentArray.map((item, index) => {
                const isSelected = comment === item;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setComment(item)}
                    className={`px-3 py-2 rounded-full ${
                      isSelected ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-white font-semibold" : "text-primary"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* BUTTON */}
            <TouchableOpacity onPress={postReview} className="bg-primary py-3 rounded-xl items-center">
              <Text className="text-white font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

    {/* REVIEWS SECTION */}
    <View className="flex-1 bg-white p-3 rounded-3xl border-secondary border-2">
      
      {/* BUTTON */}
      <TouchableOpacity onPress={handleOpen} className="bg-secondary rounded-full flex-row items-center p-2 gap-x-2 self-end mb-2">
        <FontAwesome5 name="edit" size={12} color="#2563EB" />
        <Text className="text-primary text-sm font-black">Leave a review</Text>
      </TouchableOpacity>

      {/* SCROLLABLE CONTENT */}
     { reviews.length === 0?
     <View>
      <Image source={images.no_reviews} className='w-[250px] h-[250px] flex self-center' resizeMode='contain'/><Text className='flex self-center'>No reviews yet</Text></View>: 
      <ScrollView showsVerticalScrollIndicator={false}>
        {reviews.map((item,index) => (
          <Review_card
          key={index}
          comment={item.comment}
          user_name={item.reviewer.name}
          review={item.review}
          rating={item.rating}
          image={item.reviewer.avatar}
          />
        ))}
      </ScrollView>}

    </View>
  </View>
  {loading && <DefaultLoader/>}
</SafeAreaView>

  );
}

export default myJobs;
