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
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
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
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const generateBio = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.get(
        `${api.API_URL}/api/user/generate-bio/${userId}`
      );
      const generatedBio =
        response?.data?.bio || "Generated bio not available.";
      setBio(generatedBio);
    } catch (error) {
      console.error("Error generating bio:", error);
      alert("Failed to generate a bio.");
    } finally {
      setIsGenerating(false);
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

  const goToEditInfo = () => {
    navigation.navigate("EditInfoScreen", { userId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Pressable style={styles.editIconButton} onPress={goToEditInfo}>
        <MaterialIcons name="edit" size={28} color="#3182CE" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A67D8" />
        ) : (
          <>
            <View style={styles.profileHeader}>
              <Pressable
                onPress={pickImage}
                style={styles.profileImageContainer}
              >
                <Image
                  source={{
                    uri: profileImages[0] || "https://via.placeholder.com/150",
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.cameraIconContainer}>
                  <Entypo name="camera" size={18} color="white" />
                </View>
              </Pressable>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            <View style={styles.bioSection}>
              <Text style={styles.bioLabel}>Bio:</Text>
              <View style={styles.bioInputContainer}>
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={(text) => setBio(text)}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor="#888"
                  multiline
                />
                <Pressable
                  style={styles.generateIconButton}
                  onPress={generateBio}
                  disabled={isGenerating}
                >
                  <AntDesign
                    name={isGenerating ? "loading1" : "sync"}
                    size={20}
                    color={isGenerating ? "#999" : "#5A67D8"}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                onPress={saveBio}
                style={[styles.actionButton, isSaving && styles.disabledButton]}
                disabled={isSaving}
              >
                <Text style={styles.actionButtonText}>
                  {isSaving ? "Saving..." : "Save Bio"}
                </Text>
              </Pressable>
              <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingBottom: 20,
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  editIconButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#EDF2F7",
    borderRadius: 20,
    padding: 5,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#5A67D8",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#5A67D8",
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    color: "#4A5568",
    marginTop: 5,
  },
  bioSection: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 5,
  },
  bioInputContainer: {
    position: "relative",
  },
  bioInput: {
    backgroundColor: "#EDF2F7",
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    color: "#2D3748",
    textAlignVertical: "top",
    height: 100,
    paddingRight: 40,
  },
  generateIconButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: "#5A67D8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  logoutButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
