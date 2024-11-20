import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const PromptScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [userData, setUserData] = useState();

  useEffect(() => {
    getAllUserData();
  }, []);

  const getAllUserData = async () => {
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

  const handleNext = () => {
    if (route.params && route.params.prompts) {
      saveRegistrationProgress("Prompts", { prompts: route.params.prompts });
      navigation.navigate("auth/registration/PreFinalScreen");
    } else {
      Alert.alert("Incomplete", "Please select at least one prompt.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <AntDesign name="eye" size={22} color="black" />
        </View>
        <Image
          style={styles.logo}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
          }}
        />
      </View>

      {/* Title */}
      <Text style={styles.titleText}>Write your profile answers</Text>

      {/* Prompts */}
      <View style={styles.promptContainer}>
        {route?.params?.prompts
          ? route.params.prompts.map((item, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={styles.promptBox}
              >
                <Text style={styles.promptQuestion}>{item.question}</Text>
                <Text style={styles.promptAnswer}>{item.answer}</Text>
              </Pressable>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={styles.placeholderBox}
              >
                <Text style={styles.placeholderText}>Select a Prompt</Text>
                <Text style={styles.placeholderSubText}>
                  And write your own answer
                </Text>
              </Pressable>
            ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNext}
        activeOpacity={0.8}
        style={styles.nextButton}
      >
        <MaterialCommunityIcons
          name="arrow-right-circle"
          size={45}
          color="#581845"
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PromptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  promptContainer: {
    marginTop: 30,
  },
  promptBox: {
    borderColor: "#707070",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 10,
    height: 80,
    marginBottom: 15,
    padding: 10,
  },
  promptQuestion: {
    fontWeight: "600",
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  promptAnswer: {
    fontWeight: "600",
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "center",
    color: "#581845",
    marginTop: 5,
  },
  placeholderBox: {
    borderColor: "#707070",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 10,
    height: 80,
    marginBottom: 15,
    padding: 10,
  },
  placeholderText: {
    color: "gray",
    fontWeight: "600",
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
  },
  placeholderSubText: {
    color: "gray",
    fontWeight: "600",
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  nextButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
