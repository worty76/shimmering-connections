import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { StackActions } from "@react-navigation/native";

const PromptScreen = () => {
  const route = useRoute();

  console.log("he", route?.params?.PromptsScreen);
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
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
      return null;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios
        .post("http://localhost:3000/register", userData)
        .then((response) => {
          console.log(response);
          const token = response.data.token;
          AsyncStorage.setItem("token", token);
        });
      clearAllScreenData();

      navigation.replace("Main");
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const handleNext = () => {
    if (route.params && route.params.prompts) {
      saveRegistrationProgress("Prompts", { prompts: route.params.prompts });
      navigation.navigate("auth/registration/PreFinalScreen");
    } else {
      console.error("No prompts found in route.params");
    }
  };
  return (
    <View>
      <View style={{ marginTop: 90, marginHorizontal: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderColor: "black",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="eye" size={22} color="black" />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            fontFamily: "GeezaPro-Bold",
            marginTop: 15,
          }}
        >
          Write your profile answers
        </Text>

        <View style={{ marginTop: 20, flexDirection: "column", gap: 20 }}>
          {route?.params?.prompts ? (
            route?.params?.prompts?.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={{
                  borderColor: "#707070",
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderRadius: 10,
                  height: 70,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                  }}
                >
                  {item?.question}
                </Text>
                <Text
                  style={{
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                    marginTop: 3,
                  }}
                >
                  {item?.answer}
                </Text>
              </Pressable>
            ))
          ) : (
            <View>
              <Pressable
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={{
                  borderColor: "#707070",
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderRadius: 10,
                  height: 70,
                }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                  }}
                >
                  Select a Prompt
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                    marginTop: 3,
                  }}
                >
                  And write your own answer
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={{
                  borderColor: "#707070",
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderRadius: 10,
                  height: 70,
                  marginVertical: 15,
                }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                  }}
                >
                  Select a Prompt
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                    marginTop: 3,
                  }}
                >
                  And write your own answer
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate("auth/registration/ShowPromptScreen")
                }
                style={{
                  borderColor: "#707070",
                  borderWidth: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderStyle: "dashed",
                  borderRadius: 10,
                  height: 70,
                }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                  }}
                >
                  Select a Prompt
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontWeight: "600",
                    fontStyle: "italic",
                    fontSize: 15,
                    marginTop: 3,
                  }}
                >
                  And write your own answer
                </Text>
              </Pressable>
            </View>
          )}
          {/* {route?.params?.prompts?.map((item, index) => (
            <Pressable
              onPress={() => navigation.navigate('ShowPrompts')}
              style={{
                borderColor: '#707070',
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                borderRadius: 10,
                height: 70,
              }}>
              <Text
                style={{
                  fontWeight: '600',
                  fontStyle: 'italic',
                  fontSize: 15,
                }}>
                {item?.question}
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  fontStyle: 'italic',
                  fontSize: 15,
                  marginTop: 3,
                }}>
                {item?.answer}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={() => navigation.navigate('ShowPrompts')}
            style={{
              borderColor: '#707070',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderStyle: 'dashed',
              borderRadius: 10,
              height: 70,
            }}>
            <Text
              style={{
                color: 'gray',
                fontWeight: '600',
                fontStyle: 'italic',
                fontSize: 15,
              }}>
              Select a Prompt
            </Text>
            <Text
              style={{
                color: 'gray',
                fontWeight: '600',
                fontStyle: 'italic',
                fontSize: 15,
                marginTop: 3,
              }}>
              And write your own answer
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('ShowPrompts')}
            style={{
              borderColor: '#707070',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderStyle: 'dashed',
              borderRadius: 10,
              height: 70,
            }}>
            <Text
              style={{
                color: 'gray',
                fontWeight: '600',
                fontStyle: 'italic',
                fontSize: 15,
              }}>
              Select a Prompt
            </Text>
            <Text
              style={{
                color: 'gray',
                fontWeight: '600',
                fontStyle: 'italic',
                fontSize: 15,
                marginTop: 3,
              }}>
              And write your own answer
            </Text>
          </Pressable> */}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={{ marginTop: 30, marginLeft: "auto" }}
        >
          <MaterialCommunityIcons
            name="arrow-right-circle"
            size={45}
            color="#581845"
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PromptScreen;

const styles = StyleSheet.create({});
