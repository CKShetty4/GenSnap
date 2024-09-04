import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts, searchPosts } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'



const Search = () => {

  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(()=>searchPosts(query));//This time not paasing function declaration but calling the function. That's why we are using callback function.

  const [refreshng, setrefreshng] = useState(false)
console.log(query,posts)
  useEffect(() => {
    refetch()

  }, [query])//Everytime Query changes

  //console.log(posts)
  return (
    <SafeAreaView className='bg-primary h-full'>{/* We did not use Scroll View because it does not support both horizontal and vertical scrolling at same time*/}

      <FlatList
        data={posts}
        // data={[]} To display empty state
        keyExtractor={(item: { $id: string }) => item.$id}//(item) => item.$id
        renderItem={({ item }: { item: { $id: string; title: string; thumbnail: string; video: string; creator: { username: string; avatar: string; } } }) => (
          // renderItem={({ item }) => (
          <VideoCard
            Video={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className='flex my-6 px-4 '>

            <Text className='font-pmedium text-sm text-gray-100 ' >Search Results</Text>
            <Text className='text-2xl font-psemibold text-white'>
              {query}
            </Text>


            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query.toString()} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos Found"
            subtitle="No Videos found for this Search Query" />
        )
        }
      />
    </SafeAreaView>
  )
}

export default Search