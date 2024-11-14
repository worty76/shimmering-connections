import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../constants/api";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  // useEffect(() => {
  //   const checkStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (token) {
  //         router.replace("/(tabs)/bio");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   checkStatus();
  // }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };
    axios
      .post(api.API_URL + "/api/auth/login", user)
      .then((res) => {
        if (res.status !== 200) {
          alert("Error logging in");
          return;
        } else {
          const token = res.data.token;
          AsyncStorage.setItem("token", token);
          setEmail("");
          setPassword("");
          navigation.navigate("auth/select");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("catch Error logging in");
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 0,
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
      }}
    >
      <View
        style={{
          height: 200,
          backgroundColor: "pink",
          width: "100%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Image
            style={{
              width: 150,
              height: 80,
              resizeMode: "contain",
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/6655/6655045.png",
            }}
          />
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Match Mate
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginTop: 25,
              textAlign: "center",
              fontSize: 17,
              fontWeight: "bold",
              color: "#f9629F",
            }}
          >
            Log in to your Account
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: "cover",
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/2509/2509078.png",
            }}
          />
          <View
            style={{
              marginTop: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#FFC0CB",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <MaterialCommunityIcons
                name="email"
                size={24}
                color="white"
                style={{ marginLeft: 10 }}
              />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                placeholderTextColor="white"
                style={{
                  color: "white",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 17 : 17,
                }}
              />
            </View>
            <View style={{}}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#FFC0CB",
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 30,
                }}
              >
                <AntDesign
                  name="lock"
                  size={24}
                  color="white"
                  style={{ marginLeft: 10 }}
                />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry
                  placeholder="Enter your password"
                  placeholderTextColor="white"
                  style={{
                    color: "white",
                    marginVertical: 10,
                    width: 300,
                    fontSize: password ? 17 : 17,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Keep me logged in</Text>
              <Text
                style={{
                  color: "#007FFF",
                  fontWeight: "500",
                }}
              >
                Forgot Password
              </Text>
            </View>
            <View style={{ marginTop: 30 }} />
            <Pressable
              style={{
                width: 200,
                backgroundColor: "#FFC0CB",
                borderRadius: 6,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 15,
              }}
              onPress={handleLogin}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  flexShrink: 16,
                  fontWeight: "bold",
                }}
              >
                Login
              </Text>
            </Pressable>
            <Pressable
              style={{ marginTop: 12 }}
              onPress={() => {
                navigation.navigate("auth/registration/BasicInfo");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "gray",

                  fontSize: 16,
                }}
              >
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
