import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";

const EditInfoScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const sections = [
    {
      title: "RELATIONSHIP GOALS",
      options: ["Long-term", "Short-term", "Open to both"],
    },
    {
      title: "LANGUAGES I KNOW",
      options: ["English", "Spanish", "French", "German"],
    },
    {
      title: "MORE ABOUT ME",
      fields: [
        {
          name: "Zodiac",
          options: ["Capricorn", "Aquarius", "Pisces", "Aries"],
        },
        {
          name: "Education",
          options: [
            "High school",
            "Bachelor degree",
            "Master degree",
            "PhD",
            "Trade school",
          ],
        },
        { name: "Family plans", options: ["Yes", "No", "Maybe"] },
        { name: "COVID vaccine", options: ["Yes", "No"] },
        {
          name: "Personality type",
          options: ["Introvert", "Extrovert", "Ambivert"],
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {sections.map((section, index) => (
        <View key={index} style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          {section.fields
            ? section.fields.map((field, fieldIndex) => (
                <Pressable
                  key={fieldIndex}
                  onPress={() => {
                    setSelectedOption(field);
                    setModalVisible(true);
                  }}
                  style={styles.fieldContainer}
                >
                  <Text style={styles.fieldText}>{field.name}</Text>
                  <AntDesign name="right" size={16} color="gray" />
                </Pressable>
              ))
            : section.options.map((option, optionIndex) => (
                <Pressable
                  key={optionIndex}
                  style={styles.optionContainer}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                  <AntDesign name="right" size={16} color="gray" />
                </Pressable>
              ))}
        </View>
      ))}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Entypo name="cross" size={24} color="white" />
            </Pressable>
            <Text style={styles.modalHeader}>
              More about me: {selectedOption?.name}
            </Text>
            <ScrollView>
              {selectedOption?.options.map((option, index) => (
                <Pressable key={index} style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>{option}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EditInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  sectionContainer: {
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  fieldContainer: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  fieldText: {
    color: "white",
    fontSize: 14,
  },
  optionContainer: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  optionText: {
    color: "white",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  modalHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    padding: 15,
    backgroundColor: "#282828",
    borderRadius: 5,
    marginBottom: 10,
  },
  modalOptionText: {
    color: "white",
    fontSize: 16,
  },
});
