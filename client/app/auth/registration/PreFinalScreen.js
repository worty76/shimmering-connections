import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
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
  const [loading, setLoading] = useState(false);
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    getAllUserData();
  }, []);

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

      setUserData(userData);
    } catch (error) {
      console.error("Error retrieving user data:", error);
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
    } catch (error) {
      console.error("Error clearing screen data:", error);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in userData) {
        if (key === "imageUrls" && Array.isArray(userData[key])) {
          userData[key].forEach((item) => formData.append("imageUrls", item));
        } else if (key === "prompts") {
          formData.append(key, JSON.stringify(userData[key]));
        } else {
          formData.append(key, userData[key]);
        }
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
        const token = response.data.token;
        await AsyncStorage.setItem("token", token);
        setToken(token);
        clearAllScreenData();
        navigation.navigate("index", { screen: "index" });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All set to register</Text>
        <Text style={styles.subHeaderText}>
          Setting up your profile for you
        </Text>
      </View>

      <View style={styles.loaderContainer}>
        {loading && <ActivityIndicator size="large" color="#900C3F" />}
      </View>

      <Pressable
        onPress={registerUser}
        style={[styles.registerButton, loading && { backgroundColor: "#ccc" }]}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          {loading ? "Registering..." : "Finish registering"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PreFinalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  headerContainer: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 20,
    color: "#555",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#900C3F",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
