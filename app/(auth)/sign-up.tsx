import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert('Error','Please fill all fields')
      return
    }
    setisSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username)
      //set it to global state using context

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', (error as Error).message)
    }finally{
      setisSubmitting(false)
    }
    
   }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[84vh] my-6 px-4'>
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[125px] h-[45px]" />
          <Text className='text-2xl text-white text-semibold font-psemibold  mt-10'>Welcome to GenSnap</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"//to autofill the information
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title='Sign Up'
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center flex-row gap-2 pt-5">
            <Text className="text-lg text-gray-100 font-pregular">Already have an account?</Text>
            <Link href={{ pathname: "/sign-in" }} className="text-secondary font-psemibold text-lg">Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp