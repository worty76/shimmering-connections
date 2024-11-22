import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TouchableOpacity,
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

const GenderScreen = () => {
  const [gender, setGender] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress("Gender").then((progressData) => {
      if (progressData) {
        setGender(progressData.gender || "");
      }
    });
  }, []);

  const handleNext = () => {
    if (gender.trim() !== "") {
      saveRegistrationProgress("Gender", { gender });
      navigation.navigate("TypeScreen");
    } else {
      alert("Please select your gender before proceeding.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="gender-male-female"
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

        <Text style={styles.titleText}>
          Which gender describes you the best?
        </Text>
        <Text style={styles.descriptionText}>
          Hinge users are matched based on these three gender groups. You can
          add more about gender later.
        </Text>

        {/* Gender Options */}
        <View style={styles.optionsContainer}>
          <GenderOption
            label="Men"
            selected={gender === "Men"}
            onPress={() => setGender("Men")}
          />
          <GenderOption
            label="Women"
            selected={gender === "Women"}
            onPress={() => setGender("Women")}
          />
          <GenderOption
            label="Non-binary"
            selected={gender === "Non-binary"}
            onPress={() => setGender("Non-binary")}
          />
        </View>

        {/* Visibility Checkbox */}
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

const GenderOption = ({ label, selected, onPress }) => (
  <Pressable onPress={onPress} style={styles.optionContainer}>
    <Text style={styles.optionText}>{label}</Text>
    <FontAwesome
      name="circle"
      size={26}
      color={selected ? "#581845" : "#F0F0F0"}
    />
  </Pressable>
);

export default GenderScreen;

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
