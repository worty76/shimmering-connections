import React, { useState } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  useAnimatedGestureHandler,
} from "react-native-reanimated";

const UserCard = ({ imageUrls, onPress }) => {
  const [imageIndex, setImageIndex] = useState(0); // Track the current image index
  const translateX = useSharedValue(0); // Shared value for horizontal swipe
  const translateY = useSharedValue(0); // Shared value for vertical swipe

  // Function to go to the next image
  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length); // Loop back to first image
  };

  // Function to go to the previous image
  const prevImage = () => {
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
    ); // Loop back to last image
  };

  // Handle the gesture for swiping images
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = translateX.value; // Store the starting position of the swipe
      context.startY = translateY.value; // Store the starting position of the swipe
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX; // Update horizontal translation
      translateY.value = context.startY + event.translationY; // Update vertical translation
    },
    onEnd: () => {
      if (Math.abs(translateX.value) > 150) {
        // If swipe is more than 150px, move to the next or previous image
        if (translateX.value > 0) {
          nextImage(); // Swipe right (next image)
        } else {
          prevImage(); // Swipe left (previous image)
        }
      } else {
        // Reset position if swipe is not far enough
        translateX.value = withSpring(0, { damping: 10, stiffness: 80 });
        translateY.value = withSpring(0, { damping: 10, stiffness: 80 });
      }
    },
  });

  // Animated styles for the image movement
  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value }, // Apply horizontal swipe translation
        { translateY: translateY.value }, // Apply vertical swipe translation
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Animatable.View
          style={styles.container}
          animation="zoomInDown"
          duration={500}
          easing="ease-in-sine"
        >
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={[styles.imageContainer, imageStyle]}>
              <Image
                style={styles.image}
                source={{ uri: imageUrls[imageIndex] }} // Display the current image based on the index
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.gradient}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animatable.View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    position: "relative",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0.5, height: 0.5 },
  },
  imageContainer: {
    flex: 1,
    borderRadius: 8,
    position: "relative",
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
  },
});

export default UserCard;
