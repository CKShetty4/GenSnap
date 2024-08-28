import { View, Text, FlatList } from 'react-native'
import React from 'react'

interface Post {
  id: number
}

const Trending = ({ posts }: { posts: Post[] }) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Text className='text-white text-3xl'>{item.id}</Text>
      )}
      horizontal
    />
  )
}

export default Trending