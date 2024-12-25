import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import api from "../../../constants/api";
import { useRoute, useNavigation } from "@react-navigation/native";

const EditPreferencesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [datingPreferences, setDatingPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const preferenceOptions = {
    gender: [
      { label: "Men", value: "Men" },
      { label: "Women", value: "Women" },
      { label: "Everyone", value: "Everyone" },
    ],
    zodiac: [
      { label: "Aries", value: "Aries" },
      { label: "Taurus", value: "Taurus" },
      { label: "Gemini", value: "Gemini" },
      { label: "Cancer", value: "Cancer" },
      { label: "Leo", value: "Leo" },
      { label: "Virgo", value: "Virgo" },
      { label: "Libra", value: "Libra" },
      { label: "Scorpio", value: "Scorpio" },
      { label: "Sagittarius", value: "Sagittarius" },
      { label: "Capricorn", value: "Capricorn" },
      { label: "Aquarius", value: "Aquarius" },
      { label: "Pisces", value: "Pisces" },
    ],
    passions: [
      { label: "Music", value: "Music" },
      { label: "Travel", value: "Travel" },
      { label: "Cooking", value: "Cooking" },
      { label: "Reading", value: "Reading" },
      { label: "Sports", value: "Sports" },
    ],
    education: [
      { label: "High School", value: "High School" },
      { label: "College", value: "College" },
      { label: "Postgraduate", value: "Postgraduate" },
    ],
    religion: [
      { label: "Christianity", value: "Christianity" },
      { label: "Islam", value: "Islam" },
      { label: "Hinduism", value: "Hinduism" },
      { label: "Buddhism", value: "Buddhism" },
      { label: "Atheism", value: "Atheism" },
    ],
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${api.API_URL}/api/user/profile/${userId}`
        );
        if (response.status === 200) {
          setDatingPreferences(response.data.user.datingPreferences || {});
        } else {
          Alert.alert("Error", "Failed to fetch dating preferences.");
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        Alert.alert("Error", "An error occurred while fetching preferences.");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchPreferences();
    }
  }, [userId]);

  const handleTogglePreference = (category, value) => {
    setDatingPreferences((prev) => ({
      ...prev,
      [category]: prev[category]?.includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...(prev[category] || []), value],
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${api.API_URL}/api/user/update-profile/${userId}`,
        { datingPreferences }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Dating preferences updated successfully.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update dating preferences.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      Alert.alert("Error", "An error occurred while saving preferences.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Dating Preferences</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={24} color="#DC143C" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#DC143C" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Object.keys(preferenceOptions).map((category) => (
            <View key={category} style={styles.category}>
              <Text style={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <View style={styles.optionsContainer}>
                {preferenceOptions[category].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      datingPreferences[category]?.includes(option.value) &&
                        styles.selectedOption,
                    ]}
                    onPress={() =>
                      handleTogglePreference(category, option.value)
                    }
                  >
                    <Text
                      style={[
                        styles.optionText,
                        datingPreferences[category]?.includes(option.value) &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {datingPreferences[category]?.includes(option.value) && (
                      <AntDesign name="check" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditPreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC143C",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  category: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC143C",
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC143C",
    backgroundColor: "#FFECEC",
  },
  selectedOption: {
    backgroundColor: "#DC143C",
  },
  optionText: {
    fontSize: 14,
    color: "#DC143C",
  },
  selectedOptionText: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#DC143C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
