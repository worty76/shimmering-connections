import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";

const HomeTownScreen = () => {
  const [hometown, setHometown] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress("Hometown").then((progressData) => {
      if (progressData) {
        setHometown(progressData.hometown || "");
      }
    });
  }, []);

  const handleNext = () => {
    if (hometown.trim() === "") {
      Alert.alert(
        "Validation Error",
        "Please enter your hometown before proceeding."
      );
      return;
    }
    saveRegistrationProgress("Hometown", { hometown });
    navigation.navigate("auth/registration/PhotoScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <AntDesign name="home" size={22} color="black" />
          </View>
          <Image
            style={styles.logo}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>

        <Text style={styles.titleText}>Where's your home town?</Text>

        <TextInput
          value={hometown}
          onChangeText={(text) => setHometown(text)}
          style={styles.inputField}
          placeholder="Enter your hometown"
          placeholderTextColor="#BEBEBE"
          autoFocus={true}
          keyboardType="default"
        />

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

export default HomeTownScreen;

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
    marginTop: 20,
    color: "#333",
  },
  inputField: {
    width: "100%",
    marginTop: 40,
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    color: "#000",
    borderRadius: 5,
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
});
