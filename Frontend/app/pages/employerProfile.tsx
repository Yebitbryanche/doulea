import Review_card from '@/components/Cards/reviews';
import { getReviews, writeReview } from '@/components/requests/requests';
import images from '@/types/images';
import { AntDesign, Feather, FontAwesome, FontAwesome5, Fontisto, Ionicons } from '@expo/vector-icons';
import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Linking} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import DefaultLoader from '@/components/Loader/defaultLoader';
import { Employer, Review } from '@/types/other';
import { useTheme } from '../context/ThemeContext';

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
  const {isDark} = useTheme();

  const commentArray = ["Poor","Average","Good","Excellent"]

  const handleOpen = () => {
    setIsopen(true)
  }

// open whatsapp
  const openWhatsApp = async () => {
    const phoneNumber = `+237${employerDetails?.phone}`; // Country code + number
    const message = `Hello, I saw your Job on Douleia and am interested in applying.`;

    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      alert('WhatsApp is not installed');
    }
  };

  const handleClose = () => {
    setIsopen(false)
  }

  const postReview = async() => {
    try{
      setLoading(true)
      const user_id = user?.id
      const response = await writeReview(user_id,rating, review, comment, id)
      fetch_reviews()
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
<SafeAreaView className={isDark?"flex-1 p-4 bg-white":"flex-1 p-4 bg-back"}>
  <View className="flex-1 flex-col gap-y-6">

    {/* PROFILE CARD */}
    <View className={isDark?"items-center rounded-3xl p-3 bg-secondary":"items-center rounded-3xl p-3 bg-dark"}>
      <Image source={{uri:employerDetails?.avatar}} style={{ width: 80, height: 80 }} className={isDark?'border-white border-4 rounded-full':'border-gray-800 border-4 rounded-full'}/>
      <Text className={isDark?"font-black text-dark":"font-black text-white"}>{employerDetails?.name}</Text>
      <Text className={isDark?"text-medium text-dark":"text-medium text-white"}>{employerDetails?.bio}</Text>

      <View className={isDark?"flex-row bg-white rounded-3xl items-center gap-x-5 my-4 p-5":"flex-row bg-dark rounded-3xl items-center gap-x-5 my-4 p-5"}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}>
        <View className={isDark?"bg-secondary h-[60px] w-[60px] rounded-xl items-center justify-center":"bg-back h-[60px] w-[60px] rounded-xl items-center justify-center"}>
          {isDark?<FontAwesome5 onPress={openWhatsApp} name="telegram-plane" size={24} color={'#2563EB'}/>:<FontAwesome5 onPress={openWhatsApp} name="telegram-plane" size={24} color={'#ffffff'} />}
          <Text className={isDark?'text-xs font-black text-primary':'text-xs font-black text-gray-300'}>Contact</Text>
        </View>
        <View className={isDark?"bg-secondary h-[60px] w-[60px] rounded-xl items-center justify-center":"bg-back h-[60px] w-[60px] rounded-xl items-center justify-center"}>
          {/* <FontAwesome name="star" size={24} color={'#2563EB'} /> */}
          <Text className={isDark?'text-xl font-black text-primary':'text-xl font-black text-gray-300'}>{averageRating}</Text>
          <Text className={isDark?'text-xs font-black text-primary':'text-xs font-black text-gray-300'}>Ratings</Text>
        </View>
        <View className={isDark?"bg-secondary h-[60px] w-[60px] rounded-xl items-center justify-center":"bg-back h-[60px] w-[60px] rounded-xl items-center justify-center"}>
          {/* <FontAwesome5 name="list" size={24} color={'#2563EB'} /> */}
          <Text className={isDark?'text-xl font-black text-primary':'text-xl font-black text-gray-300'}>{totalreviews}</Text>
          <Text className={isDark?'text-xs font-black text-primary':'text-xs font-black text-gray-300'}>Reviews</Text>
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
          <View className={isDark?"bg-white rounded-t-3xl p-5":"bg-dark rounded-t-3xl p-5"}>
            {isDark?
            <Ionicons onPress={handleClose} name="close" size={20} color="#232323" className='absolute right-3 top-3'/>
            :
            <Ionicons onPress={handleClose} name="close" size={20} color="#eeecec" className='absolute right-3 top-3'/>}


            {/* HANDLE */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-3" />

            {/* TITLE */}
            <Text className={isDark?"text-center text-dark font-bold text-lg mb-4":"text-center font-bold text-lg text-gray-300 mb-4"}>
              Leave a Review
            </Text>

            {/* QUESTION */}
            <Text className={isDark?"text-center font-semibold text-base":"text-center font-semibold text-gray-500"}>
              Say Something about the Employer?
            </Text>
            <Text className="text-center text-gray-500 text-sm mb-3">
              Please give your ratings & add your review
            </Text>

            {/* STARS */}
            <View className="flex-row justify-center mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Fontisto
                    name="star"
                    size={28}
                    color={i <= rating ? "#facc15" :isDark? "#d1d5db": "#4e4e53"}
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
              {/* <Feather name="image" size={18} color="#273553" /> */}
            </View>
            <View className="flex flex-row gap-x-2 justify-center p-3 flex-wrap">
              {commentArray.map((item, index) => {
                const isSelected = comment === item;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setComment(item)}
                    className={`px-3 py-2 rounded-full ${
                      isSelected ? "bg-primary" : !isDark? "bg-[#273553]":"bg-secondary"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-white font-semibold" : isDark? "text-primary":"text-white"
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
    <View className={isDark?"flex-1 bg-white p-3 rounded-3xl border-secondary border-2":"flex-1 bg-dark p-3 rounded-3xl border-gray-800 border-2"}>
      
      {/* BUTTON */}
      <TouchableOpacity onPress={handleOpen} className={isDark?"bg-secondary rounded-full flex-row items-center p-2 gap-x-2 self-end mb-2":"bg-back/30 rounded-full flex-row items-center p-2 gap-x-2 self-end mb-2"}>
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
