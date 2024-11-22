import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";
import provinceDistrictData from "../../../constants/location";

const HomeTownScreen = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getRegistrationProgress("Hometown").then((progressData) => {
      if (progressData) {
        setSelectedProvince(progressData.province || "");
        setSelectedDistrict(progressData.district || "");
      }
    });
  }, []);

  const handleNext = () => {
    if (!selectedProvince || !selectedDistrict) {
      Alert.alert(
        "Validation Error",
        "Please select both your province and district before proceeding."
      );
      return;
    }
    saveRegistrationProgress("Hometown", {
      province: selectedProvince,
      district: selectedDistrict,
    });
    navigation.navigate("PhotoScreen");
  };

  const districts =
    selectedProvince && provinceDistrictData[selectedProvince]
      ? provinceDistrictData[selectedProvince]
      : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Select your home town</Text>

        <Text style={styles.labelText}>Province</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setSelectedProvince(value);
            setSelectedDistrict("");
          }}
          value={selectedProvince}
          placeholder={{ label: "Choose a province", value: "" }}
          items={Object.keys(provinceDistrictData).map((province) => ({
            label: province,
            value: province,
          }))}
          style={pickerSelectStyles}
        />

        <Text style={styles.labelText}>District</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedDistrict(value)}
          value={selectedDistrict}
          placeholder={{ label: "Choose a district", value: "" }}
          items={districts.map((district) => ({
            label: district,
            value: district,
          }))}
          style={pickerSelectStyles}
          disabled={!selectedProvince}
        />

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    paddingHorizontal: 20,
  },
  contentContainer: {
    margin: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  labelText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#444",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#581845",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    marginBottom: 15,
  },
  inputAndroid: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    color: "#333",
    marginBottom: 15,
  },
};
