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
  const [bio, setBio] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      setBio(data?.bio || "");
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

  const saveBio = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${api.API_URL}/api/user/update-bio/${userId}`,
        {
          bio,
        }
      );

      if (response.status === 200) {
        alert("Bio updated successfully!");
        setBio(response.data.user.bio);
      } else {
        alert("Failed to update bio.");
      }
    } catch (error) {
      console.error("Error saving bio:", error);
      alert("An error occurred while saving the bio.");
    } finally {
      setIsSaving(false);
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
                  data={profileImages.filter((img) => img !== "")}
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
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={saveBio}
                  style={[styles.saveButton, isSaving && styles.disabledButton]}
                  disabled={isSaving}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "Saving..." : "Save Bio"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={fetchSuggestions}
                  style={[
                    styles.suggestionsButton,
                    suggestionsLoading && styles.disabledButton,
                  ]}
                  disabled={suggestionsLoading}
                >
                  <Text style={styles.suggestionsButtonText}>
                    {suggestionsLoading ? "Loading..." : "Generate"}
                  </Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate("EditInfoScreen", { userId })
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
    paddingBottom: 70, // Increased padding to prevent overlap with bottom tabs
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  imageSlider: {
    height: carouselHeight * 1.4,
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
    borderRadius: 15,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ccc",
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
    padding: 12,
    borderRadius: 10,
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
    fontSize: 26,
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
    borderRadius: 12,
    padding: 15,
    color: "#333",
    width: "90%",
    height: 120,
    marginVertical: 10,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#008B8B",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginRight: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  suggestionsButton: {
    backgroundColor: "#6A5ACD",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
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
    borderRadius: 15,
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
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  closeModalText: {
    color: "white",
    fontSize: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 8,
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
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 30,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
