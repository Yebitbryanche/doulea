import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { formatPrice, timeAgo } from '../utils/contraints';
import { FontAwesome6 } from '@expo/vector-icons';

export interface EmployerProps{
    user_name:string
    is_verified:boolean
}

export interface CardProps{
    id:string
    cover_image_URL?:string
    title?:string
    description:string
    created_at:string
    category?:string[]
    employer_Rating?:number
    payment:number
    employer_name?:string
    employer_verified?:boolean
    Saveicon?:React.ReactNode
    Likeicon?:React.ReactNode
    setverified?:boolean
    employer?:EmployerProps
}

const JobCard = ({
    cover_image_URL,
    title,
    description,
    created_at,
    category,
    employer_Rating,
    employer_name,
    payment,
    employer_verified,
    Saveicon,
    Likeicon,
    setverified = false
}:CardProps) => {
    const [hasImage,setHasImage] = useState(false)

    const truncate = (text: string, maxLength = 70) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.slice(0, maxLength) + " See More..."
        : text;
    };

  return (
    <View className='bg-white w-[324px] rounded-2xl m-3 p-1'
        style={{
            elevation:5,
            shadowColor:"#000",
            shadowOffset:{width:0,height:0},
            shadowOpacity:0.05,
            shadowRadius:6,
        }}>
        <Image
            source={cover_image_URL && cover_image_URL !== "null" ?{ uri: cover_image_URL }: require('../../assets/images/defaultImage.png')}
            className='w-full h-[180px] rounded-2xl'
             resizeMode={cover_image_URL && cover_image_URL !== "null"?"cover":"contain"}
        />
        <View className='bg-white p-1 right-2 top-2 rounded-2xl absolute'>
            <TouchableOpacity ><Text className='text-primary'>{Likeicon}</Text></TouchableOpacity>
        </View>
        <View className='bg-white p-1 absolute flex flex-row w-10 top-2 left-2 rounded-md items-center gap-x-1'>
            <FontAwesome6 name='star' size={10} color={"#f3db07"} />
            <Text className='text-xs font-black'>{!employer_Rating?"0":employer_Rating}</Text>
        </View>
         
        <View className='p-[0.3rem]'>
            <Text className='text-sm font-black'>{title}</Text>
            {/*  */}
            <Text className='text-sm py-2 font-medium'>{truncate(description)}</Text>
                <View>
                <View className='flex flex-row gap-x-3 py-2'>{
                    category?.map((category,index) =>
                    (<Text key={index} className='py-1 px-2 bg-secondary rounded-lg text-xs'>{category}</Text>))}</View>
                </View>
            <Text className='text-sm font-bold text-gray-400'>{formatPrice(payment)} XAF</Text>
            <View className='flex flex-row justify-between items-center'>
                <View className='flex flex-row justify-between w-full'>
                    {!employer_verified?
                
                     <View className='flex flex-row items-center'>
                        <Text>
                            <Octicons name='unverified' size={15} color={"red"}/>
                        </Text>
                        <Text className='px-1 text-red-500 text-xs'>
                            Unverified
                        </Text>
                    </View>
                    :<View className='flex flex-row items-center'>
                        <Text className='text-blue-500'>
                            <MaterialIcons name='verified' size={15} />
                        </Text>
                        <Text className='px-1 text-blue-500 text-xs'>
                            Verified
                        </Text>
                    </View>}
                    <Text className='text-xs text-gray-400'>{timeAgo(created_at?.toString())}</Text>
                </View>
            </View>
        </View>
      
    </View>
  );
}

export default JobCard;
