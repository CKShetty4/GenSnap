import { useState, useEffect, useCallback, useRef } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { icons } from "../constants";
import WebView from 'react-native-webview';
import React from 'react';

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1.1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = React.memo(({ activeItem, item }) => {
  const [Play, setPlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // const videoRef = useRef(null);

  useEffect(() => {
    if (activeItem !== item.$id) {
      setPlay(false);
    }
  }, [activeItem, item.$id]);

  // useEffect(() => {
  //   if (Play && videoRef.current && isLoaded) {
  //     videoRef.current.playAsync();
  //   }
  // }, [Play, isLoaded]);

  const injectJavaScript = `
    const video = document.querySelector('video');
    video.addEventListener('ended', () => {
      window.ReactNativeWebView.postMessage('videoFinished');
    });
  `;

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {Play ? (

         // <Video
        //   ref={videoRef}
        //   source={{ uri: item.video }}
        //   className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
        //   resizeMode={ResizeMode.CONTAIN}
        //   useNativeControls
        //   onLoad={() => setIsLoaded(true)}  // Handle loading
        //   shouldPlay
        //   onPlaybackStatusUpdate={(status) => {
        //     if (status.didJustFinish) {
        //       setPlay(false);
        //       setIsLoaded(false);  // Reset loaded state
        //     }
            
        //   }}
        //   onError={(error) => console.log('Video Error: ', error)}
        // />
        <WebView
        source={{ uri: item.video }}
        className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true} // equivalent to resizeMode={ResizeMode.CONTAIN}
        allowsInlineMediaPlayback={true} // equivalent to useNativeControls
        orientation="landscape" // allow video to rotate to landscape mode
        allowsFullscreenVideo={true} // allow video to be played in fullscreen mode
        webkit-playsinline={true} // allow video to be played inline
        onLoadStart={() => setIsLoaded(true)} // Handle loading
        onError={(error) => console.log('Video Error: ', error)}
        injectJavaScript={injectJavaScript}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'videoFinished') {
            setPlay(false);
            setIsLoaded(false); // Reset loaded state
          }
        }}
      />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
});


const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);

  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newActiveItem = viewableItems[0]?.item?.$id;
      if (newActiveItem !== activeItem) {
        setActiveItem(newActiveItem);
      }
    }
  }, [activeItem]);

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      horizontal
    />
  );
};

export default Trending;