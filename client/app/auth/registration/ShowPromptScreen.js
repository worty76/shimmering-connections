import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { SlideAnimation, ModalContent, BottomModal } from "react-native-modals";
import { useNavigation } from "@react-navigation/native";

const ShowPromptScreen = () => {
  const navigation = useNavigation();
  const [prompts, setPrompts] = useState([]);
  const [option, setOption] = useState("About me");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const promptCategories = [
    {
      id: "0",
      name: "About me",
      questions: [
        { id: "10", question: "A random fact I love is" },
        { id: "11", question: "Typical Sunday" },
        { id: "12", question: "I go crazy for" },
        { id: "13", question: "Unusual Skills" },
        { id: "14", question: "My greatest strength" },
        { id: "15", question: "My simple pleasures" },
        { id: "16", question: "A life goal of mine" },
      ],
    },
    {
      id: "2",
      name: "Self Care",
      questions: [
        { id: "10", question: "I unwind by" },
        { id: "11", question: "A boundary of mine is" },
        { id: "12", question: "I feel most supported when" },
        { id: "13", question: "I hype myself up by" },
        { id: "14", question: "To me, relaxation is" },
        { id: "15", question: "I beat my blues by" },
        { id: "16", question: "My skin care routine" },
      ],
    },
  ];

  const openModal = (item) => {
    setModalVisible(true);
    setQuestion(item?.question);
  };

  const addPrompt = () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please provide an answer.");
      return;
    }

    if (prompts.length < 3) {
      const newPrompt = { question, answer };
      setPrompts([...prompts, newPrompt]);
      setQuestion("");
      setAnswer("");
      setModalVisible(false);
    } else {
      Alert.alert("Limit Reached", "You can only select up to 3 prompts.");
    }
  };

  const removePrompt = (index) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(updatedPrompts);
  };

  const proceedToNextScreen = () => {
    if (prompts.length > 0) {
      navigation.navigate("auth/registration/PromptScreen", { prompts });
    } else {
      Alert.alert("Error", "Please select at least one prompt to proceed.");
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.viewAllText}>View all</Text>
          <Text style={styles.titleText}>Prompts</Text>
          <Entypo name="cross" size={22} color="black" />
        </View>

        {/* Categories */}
        <View style={styles.categoryContainer}>
          {promptCategories.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.categoryButton,
                option === item.name && styles.activeCategoryButton,
              ]}
              onPress={() => setOption(item.name)}
            >
              <Text
                style={[
                  styles.categoryText,
                  option === item.name && styles.activeCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Prompts */}
        <ScrollView style={styles.promptList}>
          {promptCategories.map((category) =>
            category.name === option
              ? category.questions.map((questionItem) => (
                  <Pressable
                    key={questionItem.id}
                    onPress={() => openModal(questionItem)}
                    style={styles.promptItem}
                  >
                    <Text style={styles.promptText}>
                      {questionItem.question}
                    </Text>
                  </Pressable>
                ))
              : null
          )}
        </ScrollView>

        {/* Selected Prompts */}
        <View style={styles.selectedPromptsContainer}>
          <Text style={styles.selectedPromptsTitle}>Selected Prompts:</Text>
          {prompts.map((item, index) => (
            <View key={index} style={styles.selectedPrompt}>
              <Text style={styles.selectedPromptText}>
                {item.question}: {item.answer}
              </Text>
              <Pressable onPress={() => removePrompt(index)}>
                <Entypo name="cross" size={20} color="red" />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Proceed Button */}
        <Pressable style={styles.proceedButton} onPress={proceedToNextScreen}>
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </Pressable>
      </SafeAreaView>

      {/* Modal */}
      <BottomModal
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
      >
        <ModalContent style={styles.modalContent}>
          <Text style={styles.modalTitle}>Answer your question</Text>
          <Text style={styles.modalQuestion}>{question}</Text>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            style={styles.textInput}
            placeholder="Enter Your Answer"
          />
          <Pressable style={styles.addButton} onPress={addPrompt}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default ShowPromptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#581845",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#581845",
  },
  categoryContainer: {
    flexDirection: "row",
    margin: 10,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: "#581845",
  },
  categoryText: {
    textAlign: "center",
    color: "black",
  },
  activeCategoryText: {
    color: "white",
  },
  promptList: {
    marginTop: 20,
    marginHorizontal: 12,
  },
  promptItem: {
    marginVertical: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  promptText: {
    fontSize: 15,
    fontWeight: "500",
  },
  selectedPromptsContainer: {
    marginTop: 30,
    paddingHorizontal: 12,
  },
  selectedPromptsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedPrompt: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  selectedPromptText: {
    fontSize: 15,
    fontWeight: "500",
  },
  proceedButton: {
    backgroundColor: "#581845",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 12,
  },
  proceedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    width: "100%",
    height: 280,
    padding: 20,
  },
  modalTitle: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  modalQuestion: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  textInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 15,
  },
  addButton: {
    backgroundColor: "#581845",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
