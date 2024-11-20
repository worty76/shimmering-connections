import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";

const BirthScreen = () => {
  const navigation = useNavigation();
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const handleDayChange = (text) => {
    setDay(text);
    if (text.length === 2) {
      monthRef.current.focus();
    }
  };

  const handleMonthChange = (text) => {
    setMonth(text);
    if (text.length === 2) {
      yearRef.current.focus();
    }
  };

  const handleYearChange = (text) => {
    setYear(text);
  };

  useEffect(() => {
    getRegistrationProgress("Birth").then((progressData) => {
      if (progressData) {
        const { dateOfBirth } = progressData;
        const [dayValue, monthValue, yearValue] = dateOfBirth.split("/");
        setDay(dayValue);
        setMonth(monthValue);
        setYear(yearValue);
      }
    });
  }, []);

  const validateDate = () => {
    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    if (!day || !month || !year) {
      setError("All fields are required.");
      return false;
    }

    if (isNaN(dayInt) || isNaN(monthInt) || isNaN(yearInt)) {
      setError("Date fields must be numeric.");
      return false;
    }

    if (dayInt < 1 || dayInt > 31) {
      setError("Day must be between 1 and 31.");
      return false;
    }

    if (monthInt < 1 || monthInt > 12) {
      setError("Month must be between 1 and 12.");
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (yearInt < 1900 || yearInt > currentYear) {
      setError(`Year must be between 1900 and ${currentYear}.`);
      return false;
    }

    const date = new Date(yearInt, monthInt - 1, dayInt);
    if (
      date.getDate() !== dayInt ||
      date.getMonth() + 1 !== monthInt ||
      date.getFullYear() !== yearInt
    ) {
      setError("Invalid date.");
      return false;
    }

    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateDate()) {
      const dateOfBirth = `${day}/${month}/${year}`;
      saveRegistrationProgress("Birth", { dateOfBirth });
      navigation.navigate("auth/registration/GenderScreen");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="cake-variant-outline"
              size={26}
              color="black"
            />
          </View>
        </View>
        <Text style={styles.titleText}>What's your date of birth?</Text>
        <View style={styles.inputRow}>
          {/* Day Input Field */}
          <TextInput
            autoFocus={true}
            style={[styles.input, error && !day ? styles.errorInput : null]}
            placeholder="DD"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={handleDayChange}
            value={day}
          />

          {/* Month Input Field */}
          <TextInput
            ref={monthRef}
            style={[styles.input, error && !month ? styles.errorInput : null]}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
            onChangeText={handleMonthChange}
            value={month}
          />

          {/* Year Input Field */}
          <TextInput
            ref={yearRef}
            style={[styles.input, error && !year ? styles.errorInput : null]}
            placeholder="YYYY"
            keyboardType="numeric"
            maxLength={4}
            onChangeText={handleYearChange}
            value={year}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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

export default BirthScreen;

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
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "GeezaPro-Bold",
    marginTop: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    gap: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "black",
    padding: 10,
    width: 60,
    fontSize: 20,
    fontFamily: "GeezaPro-Bold",
    textAlign: "center",
  },
  errorInput: {
    borderBottomColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
});
