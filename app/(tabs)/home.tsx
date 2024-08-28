import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  return (
    <SafeAreaView className='bg-primary'>
      <FlatList
      data={[{id:1},{id:2},{id:3},]}//Later the video data will be used here
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => (
        <View>
          <Text className='text-3xl text-white'>{item.id}
          </Text>
        </View>
      )}
ListHeaderComponent={() => (
  <View className='my-6 px-4 space-y-6'>
    <View className='flex-row mb-6 justify-between items-start'>
      <View>
      <Text className='font-pmedium text-sm text-gray-100 ' >Welcome Back</Text>
      <Text className='text-2xl font-psemibold text-white'>
        CKShetty
      </Text>
      </View>
      <View className=''>

      </View>
      
      </View>
    
  </View>
)}

      />
    </SafeAreaView>
  )
}

export default Home