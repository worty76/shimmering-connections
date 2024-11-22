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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";

const NameScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress("Name").then((progressData) => {
      if (progressData) {
        setFirstName(progressData.firstName || "");
        setLastName(progressData.lastName || "");
      }
    });
  }, []);

  const handleNext = () => {
    if (firstName.trim() !== "" && lastName.trim() !== "") {
      saveRegistrationProgress("Name", { firstName, lastName });
      navigation.navigate("EmailScreen");
    } else {
      Alert.alert(
        "Validation Error",
        "Both first name and last name are required."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.noticeText}>NO BACKGROUND CHECKS ARE CONDUCTED</Text>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="newspaper-variant-outline"
              size={26}
              color="black"
            />
          </View>
          <Image
            style={styles.logo}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.titleText}>What's your name?</Text>
          <TextInput
            autoFocus={true}
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
            style={styles.input}
            placeholder="First name (required)"
            placeholderTextColor="#BEBEBE"
          />
          <TextInput
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            style={styles.input}
            placeholder="Last name (required)"
            placeholderTextColor="#BEBEBE"
          />
        </View>

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

export default NameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  noticeText: {
    marginTop: 50,
    textAlign: "center",
    color: "gray",
    fontSize: 14,
  },
  contentContainer: {
    marginTop: 30,
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
  inputContainer: {
    marginTop: 30,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "GeezaPro-Bold",
  },
  input: {
    width: "100%",
    marginVertical: 10,
    fontSize: 22,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingBottom: 10,
    fontFamily: "GeezaPro-Bold",
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
});
