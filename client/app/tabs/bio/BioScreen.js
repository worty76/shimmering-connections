import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../constants/api";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/context/AuthContext";

const screenWidth = Dimensions.get("window").width;

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState({});
  const [profileImages, setProfileImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
  };

  const getData = async () => {
    try {
      const res = await axios.get(`${api.API_URL}/api/user/profile/${userId}`);
      if (res.status !== 200) {
        alert("Error fetching data");
        return;
      }
      const data = res?.data?.user;
      setUser(data);
      setUpdatedProfile(data);
      setProfileImages(data?.imageUrls);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const updateUserProfile = async () => {
    try {
      const res = await axios.put(
        `${api.API_URL}/api/user/update-profile/${userId}`,
        updatedProfile
      );
      if (res.status !== 200) {
        alert("Error updating profile");
        return;
      }
      alert("Profile updated successfully");
      getData();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleEditChange = (field, value) => {
    setUpdatedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      // Add your upload logic or update state with the new image URI
      alert("Image picked successfully!");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert("Logged out successfully");
      navigation.reset({
        index: 0,
        routes: [{ name: "auth/login" }],
      });
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <Image
          source={{
            uri: item,
          }}
          style={{
            width: "90%",
            height: 250,
            borderRadius: 10,
            resizeMode: "cover",
            transform: [{ rotate: "-5deg" }],
            borderWidth: 0.5,
            borderColor: "pink",
          }}
        />
        <Pressable
          onPress={() => uploadImage(item)}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 5,
            elevation: 5,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <AntDesign name="delete" size={26} color="red" />
        </Pressable>
        <Text
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "pink",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {activeIndex + 1}/{profileImages?.length}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="pink" />
      ) : (
        <>
          <View style={styles.profileImageContainer}>
            {profileImages.length > 0 ? (
              <Carousel
                width={screenWidth * 0.9}
                height={300}
                data={profileImages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text style={styles.noImagesText}>No images available</Text>
            )}
            <Pressable onPress={pickImage} style={styles.uploadButton}>
              <Entypo name="camera" size={24} color="gray" />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </Pressable>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.bioText}>
              {user.desc || "No bio available"}
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate("tabs/profile/EditInfoScreen", { userId })
              }
              style={styles.editButton}
            >
              <AntDesign name="edit" size={20} color="white" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  profileImage: {
    width: screenWidth * 0.9,
    height: 300,
    borderRadius: 20,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  noImagesText: {
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  uploadText: {
    marginLeft: 5,
    fontSize: 16,
    color: "gray",
  },
  userInfo: {
    alignItems: "center",
    marginVertical: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
  },
  bioText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
