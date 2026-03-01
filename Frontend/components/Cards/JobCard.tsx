import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';


interface CardProps{
    image?:ImageSourcePropType
    hasImage?:boolean
    title?:string
    description?:string
    time?:string
    categories?:string[]
    employer_Rating?:number
    payment?:number
    employer_name?:string
    employer_verified?:string
    Saveicon?:React.ReactNode
    Likeicon?:React.ReactNode
    setverified?:boolean
}

const JobCard = ({
    image,
    title,
    description,
    time,
    categories,
    employer_Rating,
    employer_name,
    payment,
    employer_verified,
    Saveicon,
    Likeicon,
    hasImage = false,
    setverified = false
}:CardProps) => {
  return (
    <View className='bg-white w-[90%] rounded-2xl'>
       {hasImage?
            <View>
                <Image source={image}/>
            </View>:null}

        <View className='p-[0.7rem]'>
            <View className='flex flex-row items-center justify-between'>
                <Text className='text-md font-bold'>{title}</Text>
                <Text className='text-xs text-gray-400'>{time}</Text>
            </View>
            <Text className='text-sm py-2 font-medium'>{description}</Text>
            <View className=' flex flex-row items-center justify-between'>
                <View className='flex flex-row gap-x-3 py-4'>
                    {categories?.map((category,index) =>(
                        <Text key={index} className='py-1 px-2 bg-secondary rounded-lg text-xs'>{category}</Text>
                    ))}
                </View>
                <Text>{employer_Rating}</Text>
            </View>
            <Text className='text-sm text-gray-400'>{payment} XAF</Text>
            <View className='flex flex-row justify-between items-center'>
                <View className='flex flex-row gap-x-3'>
                    <Text className='text-sm font-bold'>{employer_name}</Text>
                    {!setverified?
                
                     <View className='flex flex-row items-center'>
                        <Text>
                            <Octicons name='unverified' size={15}/>
                        </Text>
                        <Text className='px-1 text-red-500 text-xs'>
                            {employer_verified}
                        </Text>
                    </View>
                    :<View className='flex flex-row items-center'>
                        <Text className='text-blue-500'>
                            <MaterialIcons name='verified' size={15} />
                        </Text>
                        <Text className='px-1 text-blue-500 text-xs'>
                            {employer_verified}
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
