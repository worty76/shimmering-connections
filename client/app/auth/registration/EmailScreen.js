import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";

const EmailScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress("Email").then((progressData) => {
      if (progressData) {
        setEmail(progressData.email || "");
      }
    });
  }, []);

  const validateEmail = (email) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleNext = () => {
    if (email.trim() === "") {
      setError("Email is required.");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(""); // Clear error
    saveRegistrationProgress("Email", { email });
    navigation.navigate("PasswordScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Fontisto name="email" size={26} color="black" />
          </View>
          <Image
            style={styles.logo}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>

        <Text style={styles.titleText}>Please provide a valid email</Text>
        <Text style={styles.descriptionText}>
          Email verification helps us keep your account secure.{" "}
          <Text style={styles.linkText}>Learn more</Text>
        </Text>

        <TextInput
          autoFocus={true}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(""); // Clear error as the user types
          }}
          style={[
            styles.input,
            error
              ? { borderBottomColor: "red" }
              : { borderBottomColor: "black" },
          ]}
          placeholder="Enter your email"
          placeholderTextColor="#BEBEBE"
          keyboardType="email-address"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.noteText}>
          Note: You will be asked to verify your email
        </Text>

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
    </SafeAreaView>
  );
};

export default EmailScreen;

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
    fontFamily: "GeezaPro-Bold",
    marginTop: 15,
  },
  descriptionText: {
    marginTop: 30,
    fontSize: 15,
    color: "gray",
  },
  linkText: {
    color: "#581845",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    marginVertical: 10,
    fontSize: 22,
    marginTop: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    fontFamily: "GeezaPro-Bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  noteText: {
    color: "gray",
    fontSize: 15,
    marginTop: 7,
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
});
