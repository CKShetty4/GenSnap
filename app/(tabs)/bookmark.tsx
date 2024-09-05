import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getLikedPosts } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import VideoCard from '@/components/VideoCard';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';

const Bookmark = () => {
  // const { query } = useLocalSearchParams();
  const { data: likedPosts, refetch } = useAppwrite(getLikedPosts);

  const [refreshng, setrefreshng] = useState(false)
// console.log(posts)
  useEffect(() => {
    refetch()

  }, [])

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full">
    <FlatList
        // data={[]}
        data={likedPosts}
        keyExtractor={(item: { $id: string }) => item.$id}//(item) => item.$id
        renderItem={({ item }: { item: { $id: string; title: string; thumbnail: string; video: string; creator: { username: string; avatar: string; } } }) => (
          <View>
         <Text>Video will be here</Text>
          <VideoCard Video={item} /></View>
        )}
        ListHeaderComponent={() => (
          <View className='flex my-6 px-4 '>

            <Text className='font-psemibold text-xl text-white' >Saved Videos</Text>
            <View className='mt-3 mb-8'>
            <SearchInput initialQuery={''} />
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

export default Bookmark