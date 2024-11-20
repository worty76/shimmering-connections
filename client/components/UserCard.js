import React, { useState } from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

const UserCard = ({ imageUrls, onPress, userInfo }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setImageIndex((prevIndex) =>
      prevIndex - 1 < 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Animatable.View
          style={styles.container}
          animation="fadeInDown"
          duration={500}
          easing="ease-in-sine"
        >
          <View style={styles.imageContainer}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={{ uri: imageUrls[imageIndex] }}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradient}
            />
            <TouchableOpacity style={styles.leftArrow} onPress={prevImage}>
              <AntDesign name="left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightArrow} onPress={nextImage}>
              <AntDesign name="right" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>
                {`${userInfo.firstName}, ${userInfo.age}`}
              </Text>
              <Text style={styles.userLocation}>
                {userInfo.province}, {userInfo.district}
              </Text>
            </View>
          </View>
        </Animatable.View>
        <View style={styles.indicatorsContainer}>
          {imageUrls.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicator,
                imageIndex === idx && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0.5, height: 0.5 },
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  leftArrow: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  rightArrow: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  userInfoContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 2,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  userLocation: {
    color: "white",
    fontSize: 16,
    marginTop: 2,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#888",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
});

export default UserCard;
