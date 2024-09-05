import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import React, {  useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '@/components/EmptyState'
import { getUserPosts,  signOut } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import { icons } from '@/constants'
import InfoBox from '@/components/InfoBox'
import { router } from 'expo-router'


const Profile = () => {

  const { setisLoggedIn, User, setUser, } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(User.$id));//This time not paasing function declaration but calling the function. That's why we are using callback function.

  const logout = async() => {
    await signOut();
    setUser(null);
    setisLoggedIn(false);
router.replace('/sign-in')
  }

  //console.log(posts)
  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        
        keyExtractor={(item: { $id: string }) => item.$id}
        renderItem={({ item }: { item: { $id: string; title: string; thumbnail: string; video: string; creator: { username: string; avatar: string; } } }) => (
         
          <VideoCard
            Video={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              className='w-full items-end mb-10'
              onPress={
                logout
              }
            >
              <Image source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>
            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
              <Image source={{ uri: User?.avatar }} className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover' />
            </View>

            <InfoBox
              title={User?.username}
              containerStyle='mt-5'
              titleStyle='text-lg'
            />
            <View className='mt-5 flex-row'>
              <InfoBox
                title={posts?.length||0}
                subtitle='Posts'
                containerStyle='mr-10'
                titleStyle='text-xl'
              />
              <InfoBox
                title='1.2k'
                subtitle='Followers'
                titleStyle='text-xl'
              />
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

export default Profile