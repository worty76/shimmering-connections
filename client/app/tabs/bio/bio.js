import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Carousel from "react-native-reanimated-carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../constants/api";
import * as ImagePicker from "expo-image-picker";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

const bio = () => {
  const [option, setOption] = useState("AD");
  const [desc, setDesc] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [turnOns, setTurnOns] = useState([]);
  const [lookingFor, setLookingFor] = useState([]);
  const [profileImages, setProfileImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

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
          source={{ uri: item }}
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

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${api.API_URL}/api/user/profile/${userId}`
        );
        setUser(res?.data?.user);
      } catch (error) {
        console.error("Interval Error Server", error);
      }
    };

    if (userId) getUser();
  }, [userId]);

  const updateUserDesc = async () => {
    try {
      const res = await axios.put(api.api_URL + `users/${userId}/desc`, {
        desc: desc,
      });
      if (res.status !== 200) {
        alert("Error updating");
        return;
      }
      alert("Updated successfully");
    } catch (error) {
      console.error("error", error);
    }
  };
  const getData = async () => {
    try {
      const res = await axios.get(`${api.API_URL}/api/user/profile/${userId}`);
      if (res.status !== 200) {
        alert("Error fetching data");
        return;
      }
      const data = res?.data?.user;
      setDesc(data?.desc);
      setTurnOns(data?.turnOns);
      setLookingFor(data?.lookingFor);
      setProfileImages(data?.imageUrls);
      console.log(data);
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const handleToggleTurnOns = (name) => async () => {
    if (turnOns.includes(name)) {
      try {
        const res = await axios.put(
          api.api_URL + `/users/${userId}/turn-ons/remove`,
          {
            turnOns: name,
          }
        );
        if (res.status !== 200) {
          alert("Error updating");
          return;
        }
        setTurnOns(turnOns.filter((i) => i !== name));
        alert("Removed successfully");
      } catch (error) {
        console.error("Error removing turn on", error);
      }
    } else {
      try {
        const res = await axios.put(
          api.api_URL + `users/${userId}/turn-ons/add`,
          {
            turnOns: name,
          }
        );
        if (res.status !== 200) {
          alert("Error updating");
          return;
        }
        setTurnOns([...turnOns, name]);
        alert("Updated successfully");
      } catch (error) {
        console.error("Error adding turn ons", error);
      }
    }
  };
  const handleLookingFor = (name) => async () => {
    if (lookingFor.includes(name)) {
      try {
        const res = await axios.put(
          api.api_URL + `/users/${userId}/looking-for/remove`,
          {
            lookingFor: name,
          }
        );
        if (res.status !== 200) {
          alert("Error updating");
          return;
        }
        setLookingFor(lookingFor.filter((i) => i !== name));
        alert("Removed successfully");
      } catch (error) {
        console.error("Error removing looking for", error);
      }
    } else {
      try {
        const res = await axios.put(
          api.api_URL + `/users/${userId}/looking-for/add`,
          {
            lookingFor: name,
          }
        );
        if (res.status !== 200) {
          alert("Error updating");
          return;
        }
        setLookingFor([...lookingFor, name]);
        alert("Updated successfully");
      } catch (error) {
        console.error("Error adding looking for", error);
      }
    }
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
    const url = api.api_URL + `/users/${userId}/profile-images`;
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
          <View>
            <Pressable style={styles.container}>
              <Image
                source={{ uri: "../../../assets/images/lethanhdat.jpg" }}
                style={styles.logoStyle}
              />
              <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 6 }}>
                {user &&
                  user.firstName + " " + (user.lastName ? user.lastName : "")}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 15 }}>
                {user && user.email}
              </Text>
            </Pressable>
          </View>
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
        <Pressable onPress={() => setOption("Turn-ons")}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: option === "Turn-ons" ? "black" : "gray",
            }}
          >
            Turn-ons
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
      </View>
      <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
        {option === "AD" && (
          <View style={styles.bioStyle}>
            <TextInput
              multiline
              placeholder="Write your AD for people to like you"
              style={{
                fontSize: desc ? 17 : 17,
              }}
              value={desc}
              onChangeText={(text) => setDesc(text)}
            />
            <Pressable onPress={updateUserDesc} style={styles.publishBTN}>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Publish in feed
              </Text>
              <Entypo name="mask" size={24} color="white" />
            </Pressable>
          </View>
        )}
      </View>
      <View
        style={{
          marginHorizontal: 14,
        }}
      >
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
              // <Carousel
              //   layout={"stack"}
              //   data={profileImages}
              //   inverted
              //   keyExtractor={(item) => item}
              //   renderItem={renderItem}
              //   ListEmptyComponent={renderEmptyComponent}
              //   sliderWidth={350}
              //   itemWidth={300}
              //   onSnapToItem={(index) => setActiveIndex(index)}
              //   layoutCardOffset={18}
              //   autoplay
              //   autoplayInterval={1000}
              // />
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
      <View
        style={{
          marginHorizontal: 14,
        }}
      >
        {option === "Turn-ons" && (
          <>
            {api.TURNON?.map((item, index) => {
              return (
                <Pressable
                  onPress={handleToggleTurnOns(item?.name)}
                  key={index}
                  style={{
                    backgroundColor: "#FFFDD0",
                    padding: 10,
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 15,
                        fontWeight: "bold",
                        flex: 1,
                      }}
                    >
                      {item?.name}
                    </Text>
                    {turnOns.includes(item?.name) && (
                      <AntDesign name="checkcircle" size={18} color="#17B169" />
                    )}
                  </View>
                  <View>
                    <Text
                      style={{
                        marginTop: 4,
                        fontSize: 15,
                        color: "gray",
                        textAlign: "center",
                      }}
                    >
                      {item?.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </View>
      <View
        style={{
          marginHorizontal: 14,
        }}
      >
        {option === "Looking For" && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {api.LOOKING_FOR?.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={handleLookingFor(item?.name)}
                  style={[
                    styles.lookingFor,
                    {
                      backgroundColor: lookingFor.includes(item?.name)
                        ? "#fd5c63"
                        : "#FFFDD0",
                      borderWidth: lookingFor.includes(item?.name) ? 0 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 13,
                      color: lookingFor.includes(item?.name)
                        ? "white"
                        : "black",
                      fontWeight: "500",
                    }}
                  >
                    {item?.name}
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      width: 140,
                      marginTop: 10,
                      fontSize: 13,
                      color: lookingFor.includes(item?.name) ? "white" : "gray",
                    }}
                  >
                    {item?.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
        <Pressable
          onPress={async () => {
            await AsyncStorage.removeItem("token");
            navigation.navigate("auth/login");
            alert("Logged out successfully");
          }}
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
      </View>
    </ScrollView>
  );
};

export default bio;

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
  lookingFor: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    margin: 10,
    borderRadius: 5,
    borderColor: "#fd5c63",
  },
});
