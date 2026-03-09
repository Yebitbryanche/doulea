import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { KeyboardTypeOptions,InputModeOptions } from 'react-native';

interface InputProps{
    keyboardType?:KeyboardTypeOptions
    inputMode?:InputModeOptions
    label?:string
    placeholder?:string
    onChange?:(text:string) => void
    value?: string
    icon?:any
    onToggle?:() => void
    secureText?:boolean
    showPassword?:boolean
}

const InputField = ({
  label,
  placeholder,
  onChange,
  value,
  icon,
  onToggle,
  secureText = false,
  showPassword = false,
  keyboardType,
  inputMode
}: InputProps) => {
  return (
    <View>
      <Text className='font-medium'>{label}</Text>

      <View className="relative">
        <TextInput
          placeholder={placeholder}
          onChangeText={onChange}
          className="border border-gray-300 border-2 w-[320px] rounded-2xl focus:border-primary/50 focus:border-2 pr-12"
          value={value}
          secureTextEntry={secureText && !showPassword}
          keyboardType={keyboardType}
          inputMode={inputMode}
        />

        {secureText && (
          <TouchableOpacity onPress={onToggle} className="absolute right-2 top-2">
            <Image source={icon} className="h-8 w-8 object-contain" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


export default InputField;
