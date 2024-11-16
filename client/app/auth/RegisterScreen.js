import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
import api from "../../constants/api";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();
  const router = useRouter();

  const handleRegister = () => {
    const user = {
      email: email,
      password: password,
      name: name,
    };
    console.log(user);
    axios
      .post(`${api.API_URL}/api/auth/register`, user)
      .then((res) => {
        console.log(res.response);
        if (res.status !== 200) {
          console.log(res);
          alert("Error registering user");
          return;
        } else {
          setEmail("");
          setPassword("");
          setName("");
          alert("User registered successfully");
          navigation.navigate("auth/login");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error registering user", err);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: "100%",
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
              Register to your Account
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
                <AntDesign
                  name="user"
                  size={24}
                  color="white"
                  style={{ marginLeft: 10 }}
                />
                <TextInput
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Enter your name"
                  placeholderTextColor="white"
                  style={{
                    color: "white",
                    marginVertical: 10,
                    width: 300,
                    fontSize: email ? 17 : 17,
                  }}
                />
              </View>
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
              <View>
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
                onPress={handleRegister}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    flexShrink: 16,
                    fontWeight: "bold",
                  }}
                >
                  Register
                </Text>
              </Pressable>
              <Pressable
                style={{ marginTop: 12 }}
                onPress={() => {
                  navigation.navigate("auth/login");
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "gray",

                    fontSize: 16,
                  }}
                >
                  Already have an account? Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
