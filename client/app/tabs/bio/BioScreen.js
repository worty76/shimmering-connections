import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
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
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/context/AuthContext";

const screenWidth = Dimensions.get("window").width;

const Profile = () => {
  const [option, setOption] = useState("AD");
  const [desc, setDesc] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [lookingFor, setLookingFor] = useState([]);
  const [profileImages, setProfileImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
      setDesc(data?.desc);
      setLookingFor(data?.lookingFor);
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
      setEditMode(false);
      alert("Profile updated successfully");
      getData();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleEditChange = (field, value) => {
    setUpdatedProfile((prev) => ({ ...prev, [field]: value }));
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

  const renderEmptyComponent = () => {
    return (
      <View
        style={{
          height: 290,
          justifyContent: "center",
          width: Dimensions.get("window").width / 1.3,
        }}
      >
        <Text
          style={{
            color: "gray",
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
          }}
        >
          No images
        </Text>
      </View>
    );
  };

  const pickImage = async () => {
    let useLibrary = true;
    setLoading(true);
    let result;
    const option = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    };
    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(option);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(option);
    }
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };
  const uploadImage = async (uri) => {
    const url = api.API_URL + `users/${userId}/profile-images`;
    const headers = {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
    };

    if (profileImages.includes(uri)) {
      setLoading(true);
      try {
        const res = await axios.put(url + "/remove", {
          profileImages: uri,
        });
        if (res.status !== 200) {
          alert("Error updating");
          setLoading(false);
          return;
        } else {
          setProfileImages(profileImages.filter((i) => i !== uri));
          setLoading(false);
          setActiveIndex(profileImages?.length);
          alert("Removed successfully");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error removing looking for", error);
      }
    } else {
      try {
        const res = await FileSystem.uploadAsync(url, uri, headers);
        const data = JSON.parse(res.body);
        if (res.status !== 200) {
          alert("Error uploading image");
          setLoading(false);
          return;
        } else {
          setProfileImages([...profileImages, data.filePath]);
          setLoading(false);
          setActiveIndex(profileImages?.length);
          alert(data.message ?? "Image uploaded successfully");
        }
      } catch (error) {
        console.error("Error uploading image", error);
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView>
      <View>
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/thumbnails/018/977/074/original/animated-backgrounds-with-liquid-motion-graphic-background-cool-moving-animation-for-your-background-free-video.jpg",
          }}
          style={{ width: "100%", height: 200, resizeMode: "cover" }}
        />
        <View>
          <Pressable style={styles.container}>
            <Image
              source={{ uri: "../../../assets/images/lethanhdat.jpg" }}
              style={styles.logoStyle}
            />
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>
              {user && `${user.firstName} ${user.lastName || ""}`}
            </Text>
            <Text style={{ marginTop: 4, fontSize: 15 }}>
              {user && user.email}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.middleRow}>
        <Pressable onPress={() => setOption("AD")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "AD" ? "black" : "gray",
            }}
          >
            AD
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Photos")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "Photos" ? "black" : "gray",
            }}
          >
            Photos
          </Text>
        </Pressable>
        <Pressable onPress={() => setOption("Looking For")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "Looking For" ? "black" : "gray",
            }}
          >
            Looking For
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("tabs/profile/EditInfoScreen")}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: editMode ? "red" : "gray",
            }}
          >
            {editMode ? "Cancel Edit" : "Edit Profile"}
          </Text>
        </Pressable>
      </View>
      <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
        {option === "AD" && (
          <View style={styles.bioStyle}>
            {editMode ? (
              <TextInput
                multiline
                placeholder="Write your bio"
                style={{
                  fontSize: 17,
                }}
                value={updatedProfile.desc}
                onChangeText={(text) => handleEditChange("desc", text)}
              />
            ) : (
              <Text style={{ fontSize: 17 }}>{desc}</Text>
            )}
            {editMode && (
              <Pressable onPress={updateUserProfile} style={styles.publishBTN}>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "500",
                  }}
                >
                  Save Changes
                </Text>
                <Entypo name="check" size={24} color="white" />
              </Pressable>
            )}
          </View>
        )}
      </View>
      <View style={{ marginHorizontal: 14 }}>
        {option === "Photos" && (
          <View>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="pink"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 300,
                  borderWidth: 0.8,
                  borderColor: "pink",
                  borderRadius: 10,
                }}
              />
            ) : (
              <Carousel
                width={screenWidth}
                height={300}
                data={profileImages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onSnapToItem={(index) => setActiveIndex(index)}
              />
            )}

            <Pressable onPress={pickImage} style={styles.uploadBTN}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  color: "black",
                  textAlign: "center",
                }}
              >
                Upload Photo
              </Text>
              <Entypo
                name="upload-to-cloud"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          </View>
        )}
      </View>
      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: "red",
          padding: 10,
          borderRadius: 5,
          marginVertical: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          LogOut
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#DDA0DD",
    width: 300,
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    top: -80,
    left: "50%",
    transform: [{ translateX: -150 }],
  },
  logoStyle: {
    width: 65,
    height: 65,
    borderRadius: 30,
    resizeMode: "cover",
  },
  middleRow: {
    marginTop: 80,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    justifyContent: "center",
  },
  bioStyle: {
    borderColor: "#202020",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    height: 300,
  },
  publishBTN: {
    flexDirection: "row",
    marginTop: "auto",
    alignItems: "center",
    gap: 15,
    backgroundColor: "black",
    borderRadius: 5,
    justifyContent: "center",
    padding: 10,
  },
  uploadBTN: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "#DCDCDC",
    height: 50,
    borderWidth: 0.5,
    borderColor: "blue",
  },
});
