import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

interface ButtonProps{
    title:string
    onPress: () => void
}

const RegisterButton = ({title,onPress}:ButtonProps) => {
    return (
      <TouchableOpacity className='bg-primary w-[60%] px-[2rem] py-2 rounded-2xl' onPress={onPress}>
        <Text className='text-white flex self-center text-lg font-bold'> {title} </Text>
      </TouchableOpacity>
    )
}

export default RegisterButton
