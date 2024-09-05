import { View, Text } from 'react-native'
import React from 'react'

interface InfoBoxProps {
    title: any;
    containerStyle?: string;
    subtitle?:string;
    titleStyle?:string;
}
const InfoBox : React.FC<InfoBoxProps> =({title,containerStyle,subtitle,titleStyle}) => {
  return (
    <View className={` ${containerStyle} items-center justify-center`}>
      <Text className={` ${titleStyle} text-white font-psemibold `} >{title}</Text>
      <Text className="text-gray-100  text-sm font-pregular">{subtitle}</Text>
    </View>
  )
}

export default InfoBox