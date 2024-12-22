import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Button,
  FlatList,
  Platform,
  TouchableOpacity,
  Animated,
} from "react-native";
import { AntDesign, MaterialIcons, Entypo } from "@expo/vector-icons";
import axios from "axios";
import api from "../../../constants/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import provinceDistrictData from "../../../constants/location";

/**
 * MultiSelect Component for handling multiple selections using checkboxes.
 */
const MultiSelect = ({ options, selectedValues, onSelect }) => {
  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.checkboxContainer}
          onPress={() => onSelect(option.value)}
        >
          <AntDesign
            name={
              selectedValues.includes(option.value)
                ? "checksquare"
                : "checksquareo"
            }
            size={24}
            color="#DC143C"
          />
          <Text style={styles.checkboxLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const EditInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    province: "",
    district: "",
    lookingFor: "",
    datingPreferences: [],
    prompts: [{ question: "", answer: "" }],
  });
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [availablePrompts, setAvailablePrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [promptAnswer, setPromptAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const promptOptions = [
    { question: "A random fact I love is" },
    { question: "Typical Sunday" },
    { question: "I go crazy for" },
    { question: "Unusual Skills" },
    { question: "My greatest strength" },
    { question: "My simple pleasures" },
    { question: "A life goal of mine" },
    { question: "I unwind by" },
    { question: "A boundary of mine is" },
    { question: "I feel most supported when" },
    { question: "I hype myself up by" },
    { question: "To me, relaxation is" },
    { question: "I beat my blues by" },
    { question: "My skin care routine" },
  ];

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `${api.API_URL}/api/user/profile/${userId}`
        );
        if (response.status === 200) {
          setUser(response.data.user);
          setSelectedProvince(response.data.user.province || "");
          setSelectedDistrict(response.data.user.district || "");
        } else {
          alert("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        alert("An error occurred while fetching user data.");
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  /**
   * Handles input changes for text fields and picker selections.
   */
  const handleInputChange = useCallback((field, value) => {
    console.log(`Changing ${field} to ${value}`);
    if (field === "province") {
      setSelectedProvince(value);
      setSelectedDistrict("");
      setUser((prev) => ({
        ...prev,
        province: value,
        district: "",
      }));
    } else if (field === "district") {
      setSelectedDistrict(value);
      setUser((prev) => ({
        ...prev,
        district: value,
      }));
    } else if (field === "datingPreferences") {
      setUser((prev) => ({
        ...prev,
        datingPreferences: value,
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const openAddPromptModal = useCallback(() => {
    setAvailablePrompts(promptOptions);
    setModalVisible(true);
  }, []);

  const addPrompt = useCallback(() => {
    if (selectedPrompt && promptAnswer.trim() !== "") {
      const newPrompt = { question: selectedPrompt, answer: promptAnswer };
      setUser((prev) => ({
        ...prev,
        prompts: [...prev.prompts, newPrompt],
      }));
      setSelectedPrompt("");
      setPromptAnswer("");
      setModalVisible(false);
    } else {
      alert("Please select a prompt and provide an answer.");
    }
  }, [selectedPrompt, promptAnswer]);

  const removePrompt = useCallback(
    (index) => {
      const newPrompts = user.prompts.filter((_, i) => i !== index);
      setUser((prev) => ({
        ...prev,
        prompts: newPrompts,
      }));
    },
    [user.prompts]
  );

  const handleSave = useCallback(async () => {
    if (!user.firstName || !user.lastName || !user.dateOfBirth) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const updatedUserData = {
        ...user,
        province: selectedProvince,
        district: selectedDistrict,
      };
      const response = await axios.put(
        `${api.API_URL}/api/user/update-profile/${userId}`,
        updatedUserData
      );
      if (response.status === 200) {
        alert("Profile updated successfully");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedProvince, selectedDistrict, userId]);

  const districts =
    selectedProvince && provinceDistrictData[selectedProvince]
      ? provinceDistrictData[selectedProvince]
      : [];

  /**
   * Helper function to generate picker items from an array of strings.
   */
  const generatePickerItems = (itemsArray) =>
    itemsArray.map((item) => ({
      label: item,
      value: item,
    }));

  // Optional: For modal animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isModalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isModalVisible]);

  return (
    <>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go Back Button"
        >
          <AntDesign name="arrowleft" size={24} color="#DC143C" />
          <Text style={styles.goBackText}>Go Back</Text>
        </Pressable>
        <Text style={styles.header}>Edit Your Info</Text>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Basic Information</Text>
          <TextInput
            style={styles.input}
            value={user.firstName}
            placeholder="First Name"
            onChangeText={(text) => handleInputChange("firstName", text)}
            accessibilityLabel="First Name Input"
          />
          <TextInput
            style={styles.input}
            value={user.lastName}
            placeholder="Last Name"
            onChangeText={(text) => handleInputChange("lastName", text)}
            accessibilityLabel="Last Name Input"
          />
          <TextInput
            style={styles.input}
            value={user.gender}
            placeholder="Gender"
            onChangeText={(text) => handleInputChange("gender", text)}
            accessibilityLabel="Gender Input"
          />
          <TextInput
            style={styles.input}
            value={user.dateOfBirth}
            placeholder="Date of Birth (YYYY-MM-DD)"
            onChangeText={(text) => handleInputChange("dateOfBirth", text)}
            accessibilityLabel="Date of Birth Input"
          />

          {/* Province Picker */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Province</Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("province", value)}
              items={generatePickerItems(Object.keys(provinceDistrictData))}
              placeholder={{
                label: "Select Province",
                value: null,
                color: "#A0AEC0",
              }}
              value={selectedProvince}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: styles.placeholder,
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return (
                  <Entypo
                    name="chevron-down"
                    size={20}
                    color="#DC143C"
                    style={styles.pickerIcon}
                  />
                );
              }}
              accessibilityLabel="Province Selection Picker"
            />
          </View>

          {/* District Picker */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>District</Text>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("district", value)}
              items={generatePickerItems(districts)}
              placeholder={{
                label: "Select District",
                value: null,
                color: "#A0AEC0",
              }}
              value={selectedDistrict}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: styles.placeholder,
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return (
                  <Entypo
                    name="chevron-down"
                    size={20}
                    color="#DC143C"
                    style={styles.pickerIcon}
                  />
                );
              }}
              disabled={!selectedProvince}
              accessibilityLabel="District Selection Picker"
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Looking For</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={(value) => handleInputChange("lookingFor", value)}
              items={[
                { label: "Life Partner", value: "life_partner" },
                { label: "Long-term relationship", value: "long_term" },
                {
                  label: "Long-term relationship open to short",
                  value: "long_term_open_to_short",
                },
                {
                  label: "Short-term relationship open to long",
                  value: "short_term_open_to_long",
                },
                { label: "Short-term relationship", value: "short_term" },
                {
                  label: "Figuring out my dating goals",
                  value: "figuring_out_goals",
                },
              ]}
              placeholder={{
                label: "Select Looking For",
                value: null,
                color: "#A0AEC0",
              }}
              value={user.lookingFor}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: styles.placeholder,
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return (
                  <Entypo
                    name="chevron-down"
                    size={20}
                    color="#DC143C"
                    style={styles.pickerIcon}
                  />
                );
              }}
              accessibilityLabel="Looking For Selection Picker"
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Dating Preferences</Text>
          <View style={styles.pickerWrapper}>
            <MultiSelect
              options={[
                { label: "Men", value: "Men" },
                { label: "Women", value: "Women" },
                { label: "Everyone", value: "Everyone" },
              ]}
              selectedValues={user.datingPreferences}
              onSelect={(value) => {
                let newPreferences = [...user.datingPreferences];
                if (newPreferences.includes(value)) {
                  newPreferences = newPreferences.filter(
                    (item) => item !== value
                  );
                } else {
                  newPreferences.push(value);
                }
                handleInputChange("datingPreferences", newPreferences);
              }}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Prompts</Text>
          {user.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptContainer}>
              <View style={styles.promptRow}>
                <Text style={styles.promptQuestion}>{prompt.question}</Text>
                <Pressable
                  onPress={() => removePrompt(index)}
                  accessibilityLabel={`Remove prompt ${index + 1}`}
                >
                  <MaterialIcons name="delete" size={24} color="#DC143C" />
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                value={prompt.answer}
                placeholder={`Prompt ${index + 1} Answer`}
                onChangeText={(text) => {
                  const newPrompts = [...user.prompts];
                  newPrompts[index].answer = text;
                  handleInputChange("prompts", newPrompts);
                }}
                accessibilityLabel={`Answer for prompt ${index + 1}`}
              />
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={openAddPromptModal}
            accessibilityLabel="Add New Prompt Button"
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add New Prompt</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
          accessibilityLabel="Save Changes Button"
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Modal for Adding New Prompt */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            <Text style={styles.modalTitle}>Choose a Prompt</Text>
            <FlatList
              data={availablePrompts}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.promptButton,
                    selectedPrompt === item.question &&
                      styles.selectedPromptButton,
                  ]}
                  onPress={() => setSelectedPrompt(item.question)}
                  accessibilityLabel={`Select prompt: ${item.question}`}
                >
                  <Text
                    style={[
                      styles.promptButtonText,
                      selectedPrompt === item.question &&
                        styles.selectedPromptText,
                    ]}
                  >
                    {item.question}
                  </Text>
                </Pressable>
              )}
              contentContainerStyle={styles.promptGrid}
            />
            <TextInput
              placeholder="Enter Your Answer"
              value={promptAnswer}
              onChangeText={(text) => setPromptAnswer(text)}
              style={styles.modalInput}
              accessibilityLabel="Prompt Answer Input"
            />
            <View style={styles.modalButtons}>
              <Button title="Add Prompt" onPress={addPrompt} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default EditInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    padding: 15,
  },
  header: {
    color: "#DC143C",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    color: "#DC143C",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    color: "#DC143C",
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 8,
    paddingLeft: 5,
  },
  input: {
    backgroundColor: "#FFECEC",
    borderRadius: 8,
    padding: 12,
    color: "#2D3748",
    marginBottom: 12,
    fontSize: 16,
  },
  pickerWrapper: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DC143C",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFECEC",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android Elevation
    elevation: 3,
  },
  pickerInput: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "android" ? 12 : 15,
    color: "#2D3748",
    fontSize: 16,
  },
  placeholder: {
    color: "#A0AEC0",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerIcon: {
    top: Platform.OS === "ios" ? 20 : 18,
    right: 15,
  },
  modalInput: {
    backgroundColor: "#FFECEC",
    borderRadius: 8,
    padding: 12,
    color: "#2D3748",
    marginBottom: 15,
    width: "100%",
    fontSize: 16,
  },
  promptContainer: {
    marginBottom: 20,
    backgroundColor: "#FFF1F1",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DC143C",
  },
  promptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  promptQuestion: {
    color: "#DC143C",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC143C",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  addButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#DC143C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 2000, // Ensure modal appears above everything
    elevation: 2000, // For Android
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF5F5",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Android Elevation
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DC143C",
    marginBottom: 15,
    textAlign: "center",
  },
  promptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  promptButton: {
    backgroundColor: "#FFECEC",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
    margin: 6,
    minWidth: "40%",
    alignItems: "center",
  },
  selectedPromptButton: {
    backgroundColor: "#DC143C",
  },
  promptButtonText: {
    fontSize: 14,
    color: "#2D3748",
    textAlign: "center",
  },
  selectedPromptText: {
    color: "white",
    fontWeight: "bold",
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    zIndex: 1001, // Ensure it stays above dropdowns
    elevation: 1001, // For Android
  },
  goBackText: {
    color: "#DC143C",
    fontSize: 16,
    marginLeft: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2D3748",
  },
});
