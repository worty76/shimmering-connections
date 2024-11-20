import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [bio, setBio] = useState(""); // State for bio
  const [suggestions, setSuggestions] = useState([]); // State for suggestions
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      setBio(data?.bio || ""); // Load bio from backend
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const response = await axios.get(
        `${api.API_URL}/api/user/generate-bio/${userId}`
      );
      const generatedBio = response?.data?.bio || "No bio generated.";

      setBio(generatedBio);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      alert("Failed to fetch a bio suggestion.");
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <View style={styles.suggestionItem}>
      <Text style={styles.suggestionText}>{item}</Text>
    </View>
  );

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
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={(text) => setBio(text)}
                placeholder="Enter your bio..."
                placeholderTextColor="#888"
                multiline
              />
              <Pressable
                onPress={fetchSuggestions}
                style={styles.suggestionsButton}
                disabled={suggestionsLoading}
              >
                <Text style={styles.suggestionsButtonText}>
                  {suggestionsLoading
                    ? "Loading..."
                    : "Get random bio based on your prompts"}
                </Text>
              </Pressable>
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

      {/* Suggestions Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suggestions</Text>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item, index) => index.toString()}
            />
            <Pressable
              onPress={() => setIsModalVisible(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  bioInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    color: "#333",
    width: "90%",
    marginVertical: 10,
    textAlignVertical: "top",
  },
  suggestionsButton: {
    backgroundColor: "#008B8B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  suggestionsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#900C3F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeModalText: {
    color: "white",
    fontSize: 16,
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
