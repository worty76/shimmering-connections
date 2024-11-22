import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";

const Password = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (password.trim() === "" || rePassword.trim() === "") {
      setError("Both password fields are required.");
      return;
    }
    if (password.trim() !== rePassword.trim()) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Clear errors and save progress
    setError("");
    saveRegistrationProgress("Password", { password });
    navigation.navigate("BirthScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Fontisto name="locked" size={26} color="black" />
          </View>
          <Image
            style={styles.logo}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>
        <Text style={styles.titleText}>Please choose your password</Text>

        <TextInput
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={[
            styles.input,
            error
              ? { borderBottomColor: "red" }
              : { borderBottomColor: "black" },
          ]}
          placeholder="Enter your password"
          placeholderTextColor="#BEBEBE"
        />
        <TextInput
          secureTextEntry={true}
          value={rePassword}
          onChangeText={(text) => setRePassword(text)}
          style={[
            styles.input,
            error
              ? { borderBottomColor: "red" }
              : { borderBottomColor: "black" },
          ]}
          placeholder="Re-enter your password"
          placeholderTextColor="#BEBEBE"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.noteText}>
          Note: Your details will be safe with us.
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

export default Password;

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
