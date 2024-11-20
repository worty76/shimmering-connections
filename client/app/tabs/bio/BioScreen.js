import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/context/AuthContext";
import api from "../../../constants/api";

const screenWidth = Dimensions.get("window").width;
const carouselHeight = screenWidth * (9 / 16);

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState({});
  const [profileImages, setProfileImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${api.API_URL}/api/user/profile/${userId}`
      );
      const data = response?.data?.user;
      setUser(data);
      setProfileImages(data?.imageUrls || []);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    navigation.navigate("EditPhotosScreen", {
      currentImages: profileImages,
      userId: userId,
    });
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "auth/login" }] });
  };

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item }} style={styles.carouselImage} />
      <Pressable style={styles.deleteIcon}>
        <AntDesign name="delete" size={26} color="red" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#900C3F" />
        ) : (
          <>
            <View style={styles.imageSlider}>
              {profileImages.length > 0 ? (
                <Carousel
                  width={screenWidth * 0.9}
                  height={carouselHeight}
                  data={profileImages}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <Text style={styles.noImagesText}>No images available</Text>
              )}
              <Pressable onPress={pickImage} style={styles.addImageButton}>
                <Entypo name="camera" size={24} color="white" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </Pressable>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.middleContent}>
                <View style={styles.statContainer}>
                  <Text style={styles.statNumber}>{user.likesCount || 0}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
                <View style={styles.statContainer}>
                  <Text style={styles.statNumber}>
                    {user.matchesCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate("tabs/profile/EditInfoScreen", { userId })
                }
                style={styles.editButton}
              >
                <AntDesign name="edit" size={20} color="white" />
                <Text style={styles.editText}>Edit Profile</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  imageSlider: {
    height: carouselHeight * 1.4,
    marginBottom: 20,
    alignItems: "center",
  },
  carouselItem: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: carouselHeight,
  },
  carouselImage: {
    width: "90%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
    borderWidth: 0.5,
    borderColor: "pink",
    transform: [{ rotate: "-5deg" }],
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
  },
  noImagesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#900C3F",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addImageText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  userInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
    marginVertical: 5,
  },
  middleContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    gap: 10,
    marginVertical: 15,
  },
  statContainer: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008B8B",
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#008B8B",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  editText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
