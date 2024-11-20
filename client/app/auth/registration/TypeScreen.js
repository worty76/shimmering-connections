import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";

const TypeScreen = () => {
  const [type, setType] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress("Type").then((progressData) => {
      if (progressData) {
        setType(progressData.type || "");
      }
    });
  }, []);

  const handleNext = () => {
    if (type.trim() !== "") {
      saveRegistrationProgress("Type", { type });
      navigation.navigate("auth/registration/DatingTypeScreen");
    } else {
      Alert.alert("Selection Required", "Please select your sexuality.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-heart-outline"
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

        {/* Title and Description */}
        <Text style={styles.titleText}>What's your sexuality?</Text>
        <Text style={styles.descriptionText}>
          Hinge users are matched based on these preferences. You can add more
          about your sexuality later.
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Option
            label="Straight"
            selected={type === "Straight"}
            onPress={() => setType("Straight")}
          />
          <Option
            label="Gay"
            selected={type === "Gay"}
            onPress={() => setType("Gay")}
          />
          <Option
            label="Lesbian"
            selected={type === "Lesbian"}
            onPress={() => setType("Lesbian")}
          />
          <Option
            label="Bisexual"
            selected={type === "Bisexual"}
            onPress={() => setType("Bisexual")}
          />
        </View>

        {/* Visibility */}
        <View style={styles.visibilityContainer}>
          <AntDesign name="checksquare" size={26} color="#581845" />
          <Text style={styles.visibilityText}>Visible on profile</Text>
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
    </SafeAreaView>
  );
};

// Reusable Option Component
const Option = ({ label, selected, onPress }) => (
  <Pressable onPress={onPress} style={styles.optionContainer}>
    <Text style={styles.optionText}>{label}</Text>
    <FontAwesome
      name="circle"
      size={26}
      color={selected ? "#581845" : "#F0F0F0"}
    />
  </Pressable>
);

export default TypeScreen;

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
    marginTop: 15,
  },
  descriptionText: {
    marginTop: 10,
    fontSize: 15,
    color: "gray",
    lineHeight: 22,
  },
  optionsContainer: {
    marginTop: 30,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionText: {
    fontWeight: "500",
    fontSize: 16,
  },
  visibilityContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityText: {
    fontSize: 15,
    marginLeft: 8,
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
});
