import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '@/constants'
import { ResizeMode, Video } from 'expo-av';
import WebView from 'react-native-webview';

interface VideoCardProps {
  Video: {
    title: string;
    thumbnail: string;
    video: string;
    creator: {
      username: string;
      avatar: string;
    };
  };
}

const VideoCard = ({ Video: { title, thumbnail, video, creator: { username, avatar } } }: VideoCardProps) => {

const [play, setplay] = useState(false);
const [isLoaded, setIsLoaded] = useState(false);

    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='justify-center items-center flex-row flex-1'>
                    <View className='w-[46px] h-[46px] rounded-lg border-secondary justify-center items-center p-0.5'>
                        <Image source={{ uri: avatar }}
                            className='w-full  h-full rounded-lg'
                            resizeMode='cover'
                        />
                    </View>
                    <View className='justify-center gap-y-1 ml-3 flex-1 '>
                        <Text className='text-white font-psemibold text-sm' numberOfLines={1}>{title}</Text>
                        <Text className='text-xs text-gray-100 font-pregular ' numberOfLines={1}
                        >{username}</Text>
                    </View>
                </View>
                <View className='p-2'>
                    <Image source={icons.menu} className='w-5 h-5' resizeMode='contain'/>
                </View>
            </View>
{
    play?(
    //     <Video

    <WebView
        source={{ uri: video }}
        className="w-full h-60 rounded-xl mt-3"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true} // equivalent to resizeMode={ResizeMode.CONTAIN}
        allowsInlineMediaPlayback={true} // equivalent to useNativeControls
        orientation="landscape" // allow video to rotate to landscape mode
        allowsFullscreenVideo={true} // allow video to be played in fullscreen mode
        webkit-playsinline={true} // allow video to be played inline
        onLoadStart={() => setIsLoaded(true)} // Handle loading
        onError={(error) => console.log('Video Error: ', error)}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'videoFinished') {
            setplay(false);
            setIsLoaded(false); // Reset loaded state
          }
        }}
      />
):(
<TouchableOpacity 
        activeOpacity={0.7}
        onPress={()=>setplay(true)}
    className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
<Image source={{uri: thumbnail}}
className='w-full h-full rounded-xl mt-3'
resizeMode='cover'/>
<Image source={icons.play}
className='w-12 h-12 absolute'
resizeMode='contain'/>
    </TouchableOpacity>)
}
        </View>
    )
}

export default VideoCard