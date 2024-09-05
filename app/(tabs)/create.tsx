import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import { Video, ResizeMode } from 'expo-av'
import { icons } from '@/constants'
import CustomButton from '@/components/CustomButton'

const Create = () => {

  const [uploading, setuploading] = useState(false)

  interface Form {
    title: string;
    video: { uri: string } | null;
    thumbnail: any | null;
    prompt: string;
  }

  const [form, setForm] = useState<Form>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });

  const submit=()=>{

  }
  return (


    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold '>
          Create Post
        </Text>
        <FormField
          title='Video Title'
          value={form.title}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          placeholder='Give your video a catchy title...'
          otherStyles='mt-10 text-white'
        />
        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Upload a video
          </Text>
          <TouchableOpacity >

            {form.video ?
              (
                <Video
                  source={{ uri: form.video.uri }}
                  className='w-full h-64 rounded-2xl'
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
              ) :
              (
                <View className='w-full h-40 rounded-2xl justify-center items-center bg-black-100 px-4'>
                  <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center '>
                    <Image source={icons.upload} className='w-1/2 h-1/2' resizeMode='contain' />
                  </View>
                </View>
              )
            }
          </TouchableOpacity>

        </View>
<View className='mt-7 space-y-2 '>
<Text className='text-base text-gray-100 font-pmedium'>
            Upload a Thumbnail Image
          </Text>
          <TouchableOpacity >

            {form.thumbnail ?
              (
                <Image 
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
                />
              ) :
              (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className='text-sm font-pmedium text-gray-100'>
                  Choose a File
                </Text>
                </View>
              )
            }
          </TouchableOpacity>
</View>
<FormField
          title='AI Prompt'
          value={form.prompt}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          placeholder='The Prompt You used to create the video...'
          otherStyles='mt-7 text-white'
        />
        <CustomButton
        title='Submit and Publish'
        handlePress={submit}
        containerStyles='mt-10'
        isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create