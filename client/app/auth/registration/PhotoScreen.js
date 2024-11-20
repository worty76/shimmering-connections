import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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
      navigation.navigate("auth/registration/PreFinalScreen");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
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
        <View style={styles.promptsContainer}>
          {route?.params?.prompts ? (
            route?.params?.prompts.map((item, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={styles.promptBox}
              >
                <Text style={styles.promptQuestion}>{item?.question}</Text>
                <Text style={styles.promptAnswer}>{item?.answer}</Text>
              </Pressable>
            ))
          ) : (
            <View>
              {[...Array(3)].map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() =>
                    navigation.navigate("auth/registration/ShowPromptScreen")
                  }
                  style={styles.promptBox}
                >
                  <Text style={styles.placeholderText}>
                    Select a Prompt and write your own answer
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
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
      </View>
    </ScrollView>
  );
};

export default PromptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    marginTop: 90,
    marginHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "black",
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
    marginTop: 15,
    color: "#333",
  },
  promptsContainer: {
    marginTop: 20,
  },
  promptBox: {
    borderColor: "#707070",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 20,
    marginBottom: 15,
  },
  promptQuestion: {
    fontWeight: "600",
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    color: "#333",
  },
  promptAnswer: {
    fontWeight: "600",
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 5,
    color: "#581845",
  },
  placeholderText: {
    fontWeight: "600",
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
    color: "gray",
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
});
