import { View, Text, TextInput ,TouchableOpacity, Image} from 'react-native'
import React, { useState } from 'react'

import {icons} from '../constants';

interface FormFieldProps {
    title: string;
    value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
    otherStyles?: string;
    keyboardType?:string;
  }
  
  const FormField: React.FC<FormFieldProps> = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
  }) => {
const [showPassword, setshowPassword] = useState(false)
    
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View 
      className="border-2
       border-black-200 
       w-full h-16 px-4
        bg-black-100 
        rounded-2xl
        flex-row
         items-center
          focus:border-secondary">
<TextInput className="flex-1 text-white font-psemibold"
value={value}
placeholder={placeholder}
placeholderTextColor="#7B7B8B"
onChangeText={handleChangeText}
secureTextEntry={title === 'Password' && !showPassword}
/>
{title === 'Password' && (
    <TouchableOpacity onPress={()=>setshowPassword(!showPassword)}>
        <Image source={!showPassword? icons.eye:icons.eyeHide} className="w-6 h-6" resizeMode="contain"/> 
    </TouchableOpacity>
)}
      </View>
    </View>
  )
}

export default FormField