import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../constants/api";

const PreFinalScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userData, setUserData] = useState();
  useEffect(() => {
    getAllUserData();
  }, []);

  const { token, isLoading, setToken } = useContext(AuthContext);

  console.log(token);

  useEffect(() => {
    if (token) {
      navigation.navigate("MainStack", { screen: "Main" });
    }
  }, [token, navigation]);
  const getAllUserData = async () => {
    try {
      const screens = [
        "Name",
        "Email",
        "Password",
        "Birth",
        "Location",
        "Gender",
        "Type",
        "Dating",
        "LookingFor",
        "Hometown",
        "Photos",
        "Prompts",
      ];

      let userData = {};

      for (const screenName of screens) {
        const screenData = await getRegistrationProgress(screenName);
        if (screenData) {
          userData = { ...userData, ...screenData };
        }
      }

      console.log(userData);

      setUserData(userData);
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  };
  const clearAllScreenData = async () => {
    try {
      const screens = [
        "Name",
        "Email",
        "Birth",
        "Location",
        "Gender",
        "Type",
        "Dating",
        "LookingFor",
        "Hometown",
        "Photos",
      ];
      for (const screenName of screens) {
        const key = `registration_progress_${screenName}`;
        await AsyncStorage.removeItem(key);
      }
      console.log("All screen data cleared successfully");
    } catch (error) {
      console.error("Error clearing screen data:", error);
    }
  };

  const registerUser = async () => {
    try {
      const formData = new FormData();
      for (const key in userData) {
        if (key === "imageUrls" && Array.isArray(userData[key])) {
          userData[key].forEach((item, index) => {
            if (typeof item === "string") {
              // Append the image URI directly as a string
              formData.append("imageUrls", item);
            } else {
              console.log(
                `Unexpected item type for image at index ${index}:`,
                item
              );
            }
          });
        } else if (key === "prompts") {
          formData.append(key, JSON.stringify(userData[key]));
        } else {
          formData.append(key, userData[key]);
        }
      }

      // Debug: Log the `FormData` entries
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await axios.post(
        `${api.API_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        console.log(response);
        const token = response.data.token;
        await AsyncStorage.setItem("token", token);
        setToken(token);
        navigation.navigate("tabs/index", { screen: "tabs/index" });
        clearAllScreenData();
      }
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 80 }}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            fontFamily: "GeezaPro-Bold",
            marginLeft: 20,
          }}
        >
          All set to register
        </Text>
        <Text
          style={{
            fontSize: 33,
            fontWeight: "bold",
            fontFamily: "GeezaPro-Bold",
            marginLeft: 20,
            marginRight: 10,
            marginTop: 10,
          }}
        >
          Setting up your profile for you
        </Text>
      </View>

      <View>
        {/* <LottieView
          source={require("../assets/love.json")}
          style={{
            height: 260,
            width: 300,
            alignSelf: "center",
            marginTop: 40,
            justifyContent: "center",
          }}
          autoPlay
          loop={true}
          speed={0.7}
        /> */}
      </View>

      <Pressable
        onPress={registerUser}
        style={{ backgroundColor: "#900C3F", padding: 15, marginTop: "auto" }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          Finish registering
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PreFinalScreen;

const styles = StyleSheet.create({});
