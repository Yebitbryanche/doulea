import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useState } from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { formatPrice, timeAgo } from '../utils/contraints';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/context/ThemeContext';

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
    employer_rating?:number
    payment:number
    employer_name?:string
    employer_verified?:boolean
    Likeicon?:React.ReactNode
    setverified?:boolean
    employer?:EmployerProps
    location?:string
    views?:number
}

const JobCard = ({
    cover_image_URL,
    title,
    description,
    created_at,
    category,
    employer_rating,
    employer_name,
    payment,
    employer_verified,
    views,
    Likeicon,
    setverified = false
}:CardProps) => {
    const {isDark} = useTheme()
    const {t} = useTranslation();

    const truncate = (text: string, maxLength = 70) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.slice(0, maxLength) + " See More..."
        : text;
    };

  return (
    <View className={isDark?'bg-white rounded-2xl m-3 p-1':'bg-dark rounded-2xl m-3 p-1'}
        style={{
            elevation:5,
            shadowColor:"#000",
            shadowOffset:{width:0,height:0},
            shadowOpacity:0.05,
            shadowRadius:6,
        }}>
        {  cover_image_URL &&      
            <Image
            source={cover_image_URL && cover_image_URL !== "null" ?{ uri: cover_image_URL }: require('../../assets/images/defaultImage.png')}
            className='w-full h-[180px] rounded-2xl'
             resizeMode={cover_image_URL && cover_image_URL !== "null"?"cover":"contain"}
            />
        }
        <View className={isDark?'bg-white p-1 right-2 top-2 rounded-2xl absolute':'bg-dark p-1 right-2 top-2 rounded-2xl absolute'}>
            <TouchableOpacity ><Text className='text-primary'>{Likeicon}</Text></TouchableOpacity>
        </View>
        <View className={isDark?
            'bg-white p-1 absolute flex flex-row w-10 top-2 left-2 rounded-md items-center gap-x-1':
            'bg-dark p-1 absolute flex flex-row w-10 top-2 left-2 rounded-md items-center gap-x-1'}>
            <FontAwesome6 name='star' size={10} color={"#f3db07"} />
            <Text className={isDark?'text-xs font-black text-black':'text-xs font- text-white'}>{!employer_rating?"0":employer_rating}</Text>
        </View>

        <View className={isDark?
            'bg-white/30 p-1 absolute flex flex-row bottom-4 right-2 rounded-md items-center gap-x-1'
            :   
            'p-1 absolute flex flex-row bottom-4 right-2 rounded-md items-center gap-x-1'}>
            <Ionicons name='eye-outline' size={17} color={"#b3b1b1"} />
            <Text className={'text-xs font-bold text-gray-400'}>{!views?"0":views} Views</Text>
        </View>
         
        <View className='px-[0.3rem] pt-8'>
            <Text className={isDark?'text-sm text-dark font-black':'text-sm text-white font-black'}>{title}</Text>
            {/*  */}
            <Text className={isDark?'text-sm py-2 font-medium text-dark':'text-sm py-2 font-medium text-white'}>{truncate(description)}</Text>
                <View>
                <View className='flex flex-row gap-x-3 py-2'>{
                    category?.map((category,index) =>
                    (<Text key={index} className={isDark?'py-1 px-2 bg-secondary text-black rounded-lg text-xs':'py-1 px-2 bg-primary/50 text-white rounded-lg text-xs'}>{t(category)}</Text>))}</View>
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
                            {t("unverified")}
                        </Text>
                    </View>
                    :<View className='flex flex-row items-center'>
                        <Text className='text-blue-500'>
                            <MaterialIcons name='verified' size={15} />
                        </Text>
                        <Text className='px-1 text-blue-500 text-xs'>
                            {t("verified")}
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
