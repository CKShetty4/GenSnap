import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable'

const ZoomIn={
  0:{
    scale:0.9
  },
  1:{
    scale:1
  }
}

const ZoomOut={
  0:{
    scale:1
  },
  1:{
    scale:0.9
  }
}


const TrendingItem = ({activeItem, item}: {activeItem: any, item: any}) => {
  const [play, setplay] = useState(false)
  return (
    <Animatable.View 
    className='mr-5'
    //animation={activeItem===item.$id ? ZoomIn : ZoomOut }
    animation={activeItem===item.$id ? JSON.stringify(ZoomIn) : JSON.stringify(ZoomOut)}
    duration={500}
    >
      {play?(<Text>Playing</Text>):(<TouchableOpacity/>)}
    </Animatable.View>
  )
}

interface Post {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
}

const Trending = ({ posts }: { posts: Post[] }) => {
const [activeItem, setactiveItem] = useState(posts[0]);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: { $id: string }) => item.$id}//(item) => item.$id
        renderItem={({ item }: { item: { $id: string; title: string; thumbnail: string; video: string; creator: { username: string; avatar: string; } } }) => (
          // renderItem={({ item }) => (
          <TrendingItem
          activeItem={}
          />)}
      horizontal
    />
  )
}

export default Trending