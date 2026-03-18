import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { timeAgo } from '../utils/contraints';

export interface EmployerProps{
    user_name:string
    is_verified:boolean
}

export interface CardProps{
    id?:string
    cover_image_URL?:string
    title?:string
    description?:string
    created_at:string
    category?:string[]
    employer_Rating?:number
    payment?:number
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
  return (
    <View className='bg-white w-[320px] rounded-2xl m-3 shadow shadow-inset-xl'>
        {cover_image_URL && cover_image_URL !== "null" ? (
        <Image
            source={{ uri: cover_image_URL }}
            className='w-full h-[150px] rounded-tl-2xl rounded-tr-2xl'
        />
        ) : (
        null
        )}
        <View className='p-[0.7rem]'>
            <View className='flex flex-row items-center justify-between'>
                <Text className='text-md font-bold'>{title}</Text>
                <Text className='text-xs text-gray-400'>{timeAgo(created_at?.toString())}</Text>
            </View>
            <Text className='text-sm py-2 font-medium'>{description}</Text>
            <View className=' flex flex-row items-center justify-between'>
                <View className='flex flex-row gap-x-3 py-2'>
                    {category?.map((category,index) =>(
                        <Text key={index} className='py-1 px-2 bg-secondary rounded-lg text-xs'>{category}</Text>
                    ))}
                </View>
                <Text>{employer_Rating}</Text>
            </View>
            <Text className='text-sm font-bold text-gray-400'>{payment} XAF</Text>
            <View className='flex flex-row justify-between items-center'>
                <View className='flex flex-row gap-x-3'>
                    <Text className='text-sm font-bold'>Contact {employer_name}</Text>
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
                </View>
                <View className='flex flex-row gap-x-5 items-center'>
                    <TouchableOpacity ><Text className='text-primary'>{Saveicon}</Text></TouchableOpacity>
                    <TouchableOpacity ><Text className='text-primary'>{Likeicon}</Text></TouchableOpacity>
                </View>
            </View>
        </View>
      
    </View>
  );
}

export default JobCard;
