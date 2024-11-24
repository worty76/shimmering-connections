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
import group from "../../assets/images/Group.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const route = useRoute();
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [option, setOption] = useState("Create account");
  const { token, isLoading, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      navigation.navigate("MainStack", { screen: "Main" });
    }
  }, [token, navigation]);

  const signInUser = async () => {
    setOption("Sign In");

    try {
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
    navigation.navigate("BasicInfo");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <View style={styles.innerContainer}>
          {option == "Sign In" ? (
            <>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  style={styles.icon}
                  name="email"
                  size={24}
                  color="white"
                />
                <TextInput
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="Enter your email"
                  placeholderTextColor={"white"}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <AntDesign
                  style={styles.icon}
                  name="lock1"
                  size={24}
                  color="white"
                />
                <TextInput
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  secureTextEntry={true}
                  placeholder="Enter your password"
                  placeholderTextColor="white"
                  style={styles.input}
                />
              </View>

              <View style={styles.rememberContainer}>
                <Text>Keep me logged in</Text>
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.imageContainer}>
                <Image source={group} style={styles.image} />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  Let's meeting people around you
                </Text>
              </View>
            </>
          )}

          <Pressable
            onPress={createAccount}
            style={[
              styles.button,
              option == "Create account" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                option == "Create account" && styles.activeButtonText,
              ]}
            >
              Create account
            </Text>
          </Pressable>

          <Pressable
            onPress={signInUser}
            style={[
              styles.button,
              option == "Sign In" && styles.activeButton,
              { marginTop: 20 },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                option == "Sign In" && styles.activeButtonText,
              ]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  innerContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#581845",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    color: "white",
    marginVertical: 10,
    flex: 1,
  },
  rememberContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  forgotPasswordText: {
    color: "#007FFF",
    fontWeight: "500",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    width: "100%",
  },
  image: {
    height: 250,
    resizeMode: "contain",
    width: "100%",
  },
  titleContainer: {
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "#581845",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  activeButtonText: {
    color: "white",
  },
});
