import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '@/components/SearchInput'

const Home = () => {
  return (
    <SafeAreaView className='bg-primary'>
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 },]}//Later the video data will be used here
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text className='text-3xl text-white'>{item.id}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className='flex my-6 px-4 space-y-6 '>
            <View className=' flex-row justify-between items-center mb-6'>
              <View >
                <Text className='font-pmedium text-sm text-gray-100 ' >Welcome Back</Text>
                <Text className='text-2xl font-psemibold text-white'>
                  CKShetty
                </Text>
              </View>
              <View className='mt-1.5 flex-row'>
                <Image
                  source={images.logoSmall}
                  className="w-8 h-16"
                  resizeMode='contain' />
              </View>

            </View>
<SearchInput/>
<View className='w-full flex-1 pt-5 pb-8'>
  {/* Latest Video Section */}
<Text className='text-gray-100 text-lg font-pregular mb-3'>
  Latest Videos
</Text>
</View>
          </View>
        )}

      />
    </SafeAreaView>
  )
}

export default Home