import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'

const Home = () => {

const [refreshng, setrefreshng] = useState(false)

const onRefresh= async()=>{
  setrefreshng(true)
  //recall posts/videos to check if new videos are available
  setrefreshng(false)
}


  return (
    <SafeAreaView className='bg-primary h-full'>{/* We did not use Scroll View because it does not support both horizontal and vertical scrolling at same time*/}
      
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 },]}//Later the video data will be used here
        // data={[]} To display empty state
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text className='text-3xl text-white'>{item.id}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View className='flex my-6 px-4 space-y-6  '>
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
  Trending Videos
</Text>
<Trending posts={[{id:1},{id:2},{id:3}]??[]}/>
</View>
          </View>
        )}
ListEmptyComponent={() => (
<EmptyState 
title="No videos Found"
subtitle="Be the first one to create the video"/>
)
}
refreshControl={<RefreshControl
refreshing={refreshng}
onRefresh={onRefresh}
/>}
    />
    </SafeAreaView>
  )
}

export default Home