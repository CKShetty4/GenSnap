import { TouchableOpacity,Text } from 'react-native'
import React from 'react'

interface CustomButtonProps {
    title: string;
    handlePress: () => void;
    containerStyles?: string;
    textStyles?: string;
    isLoading?: boolean;
  }
  
  const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
  }) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading?'opacity-50':''}`}
     >
        <Text className={`text-primary text-lg font-psemibold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton