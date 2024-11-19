import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LottieView from "lottie-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage, {
  useAsyncStorage,
} from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import api from "../../constants/api";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const route = useRoute();
  console.log(route);
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [option, setOption] = useState("Create account");
  const { token, isLoading, setToken } = useContext(AuthContext);

  console.log(token);

  useEffect(() => {
    // Check if the token is set and not in loading state
    if (token) {
      // Navigate to the main screen
      navigation.navigate("MainStack", { screen: "Main" });
    }
  }, [token, navigation]);
  const signInUser = async () => {
    setOption("Sign In");

    try {
      console.log(email);
      console.log(password);
      const user = {
        email: email,
        password: password,
      };
      const response = await axios.post(`${api.API_URL}/api/auth/login`, user);
      const token = response.data.token;

      await AsyncStorage.setItem("token", token);

      setToken(token);
      navigation.navigate("tabs/index");
    } catch (error) {
      console.log("error", error);
    }
  };
  const createAccount = () => {
    setOption("Create account");

    navigation.navigate("auth/registration/BasicInfo");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View
        style={{
          height: 200,
          backgroundColor: "#581845",
          width: "100%",
          borderBottomLeftRadius: 100,
          borderBottomRightRadius: 100,
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
            style={{ width: 150, height: 80, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/4310/4310217.png",
            }}
          />
        </View>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 23,
            fontFamily: "GeezaPro-Bold",
            color: "white",
          }}
        >
          Shimmering Connections
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}></View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 100, height: 80, resizeMode: "cover" }}
            source={{
              uri: "https://branditechture.agency/brand-logos/wp-content/uploads/wpdm-cache/Hinge-App-900x0.png",
            }}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          {option == "Sign In" ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#581845",
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 30,
                }}
              >
                <MaterialIcons
                  style={{ marginLeft: 8 }}
                  name="email"
                  size={24}
                  color="white"
                />
                <TextInput
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Enter your email"
                  placeholderTextColor={"white"}
                  style={{
                    color: "white",
                    marginVertical: 10,
                    width: 300,
                    // fontSize: password ? 17 : 17,
                  }}
                />
              </View>

              <View style={{}}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: "#581845",
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 30,
                  }}
                >
                  <AntDesign
                    style={{ marginLeft: 8 }}
                    name="lock1"
                    size={24}
                    color="white"
                  />
                  <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                    placeholder="Enter your password"
                    style={{
                      color: "white",
                      marginVertical: 10,
                      width: 300,
                      //   fontSize: password ? 17 : 17,
                    }}
                    placeholderTextColor="white"
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

                <Text style={{ color: "#007FFF", fontWeight: "500" }}>
                  Forgot Password
                </Text>
              </View>
            </>
          ) : (
            <View>
              <LottieView
                source={require("../../assets/login.json")}
                style={{
                  height: 180,
                  width: 300,
                  alignSelf: "center",
                  marginTop: 40,
                  justifyContent: "center",
                }}
                autoPlay
                loop={true}
                speed={0.7}
              />
            </View>
          )}

          <View style={{ marginTop: 40 }} />

          <Pressable
            onPress={createAccount}
            style={{
              width: 300,
              backgroundColor:
                option == "Create account" ? "#581845" : "transparent",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
              borderRadius: 30,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: option == "Create account" ? "white" : "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Create account
            </Text>
          </Pressable>

          <Pressable
            onPress={signInUser}
            style={{
              width: 300,
              backgroundColor: option == "Sign In" ? "#581845" : "transparent",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
              borderRadius: 30,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: option == "Sign In" ? "white" : "black",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
