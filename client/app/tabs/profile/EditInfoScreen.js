import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import api from "../../../constants/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

const EditInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    hometown: "",
    lookingFor: "",
    datingPreferences: [],
    prompts: [{ question: "", answer: "" }],
  });
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
        } else {
          alert("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const openAddPromptModal = () => {
    setAvailablePrompts(promptOptions);
    setModalVisible(true);
  };

  const addPrompt = () => {
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
  };

  const removePrompt = (index) => {
    const newPrompts = user.prompts.filter((_, i) => i !== index);
    setUser((prev) => ({
      ...prev,
      prompts: newPrompts,
    }));
  };

  const handleSave = async () => {
    if (!user.firstName || !user.lastName || !user.dateOfBirth) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const updatedUserData = user;
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
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Pressable
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
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
          />
          <TextInput
            style={styles.input}
            value={user.lastName}
            placeholder="Last Name"
            onChangeText={(text) => handleInputChange("lastName", text)}
          />
          <TextInput
            style={styles.input}
            value={user.gender}
            placeholder="Gender"
            onChangeText={(text) => handleInputChange("gender", text)}
          />
          <TextInput
            style={styles.input}
            value={user.dateOfBirth}
            placeholder="Date of Birth (YYYY-MM-DD)"
            onChangeText={(text) => handleInputChange("dateOfBirth", text)}
          />
          <TextInput
            style={styles.input}
            value={user.hometown}
            placeholder="Hometown"
            onChangeText={(text) => handleInputChange("hometown", text)}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Looking For</Text>
          <RNPickerSelect
            onValueChange={(value) => handleInputChange("lookingFor", value)}
            value={user.lookingFor || ""}
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
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Dating Preferences</Text>
          {user.datingPreferences.map((preference, index) => (
            <RNPickerSelect
              key={index}
              onValueChange={(value) => {
                const newPreferences = [...user.datingPreferences];
                newPreferences[index] = value;
                handleInputChange("datingPreferences", newPreferences);
              }}
              value={preference}
              placeholder={{ label: `Select Preference`, value: "null" }}
              items={[
                { label: "Men", value: "Men" },
                { label: "Women", value: "Women" },
                { label: "Everyone", value: "Everyone" },
              ]}
              style={pickerSelectStyles}
            />
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() =>
              handleInputChange("datingPreferences", [
                ...user.datingPreferences,
                "",
              ])
            }
          >
            <AntDesign name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Preference</Text>
          </Pressable>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Prompts</Text>
          {user.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptContainer}>
              <View style={styles.promptRow}>
                <Text style={styles.promptQuestion}>{prompt.question}</Text>
                <Pressable onPress={() => removePrompt(index)}>
                  <MaterialIcons name="delete" size={24} color="red" />
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
              />
            </View>
          ))}
          <Pressable style={styles.addButton} onPress={openAddPromptModal}>
            <AntDesign name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add New Prompt</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Modal for Adding New Prompt */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Prompt</Text>
            <ScrollView contentContainerStyle={styles.promptGrid}>
              {availablePrompts.map((item, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.promptButton,
                    selectedPrompt === item.question &&
                      styles.selectedPromptButton,
                  ]}
                  onPress={() => setSelectedPrompt(item.question)}
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
              ))}
            </ScrollView>
            <TextInput
              placeholder="Enter Your Answer"
              value={promptAnswer}
              onChangeText={(text) => setPromptAnswer(text)}
              style={styles.modalInput}
            />
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Button title="Add Prompt" onPress={addPrompt} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 15,
  },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    color: "#FF4081",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 15,
    width: "100%", // Full width within the modal
  },
  promptContainer: {
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  promptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  promptQuestion: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4081",
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
    backgroundColor: "green",
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
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF4081",
    marginBottom: 15,
  },
  promptGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  promptButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    margin: 6,
  },
  selectedPromptButton: {
    backgroundColor: "#581845",
  },
  promptButtonText: {
    fontSize: 14,
    color: "white",
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
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 12,
  },
  inputAndroid: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: "white",
    marginBottom: 12,
  },
};
