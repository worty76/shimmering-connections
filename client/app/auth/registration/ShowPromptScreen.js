import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { SlideAnimation } from "react-native-modals";
import { useNavigation } from "@react-navigation/native";
import { ModalTitle } from "react-native-modals";
import { ModalContent, BottomModal } from "react-native-modals";

const ShowPromptScreen = () => {
  const navigation = useNavigation();
  const [prompts, setPrompts] = useState([]);
  const promptss = [
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
  const [option, setOption] = useState("About me");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = (item) => {
    setModalVisible(true);
    setQuestion(item?.question);
  };

  const addPrompt = () => {
    if (answer === "") {
      setQuestion("");
      setAnswer("");
      setModalVisible(false);
      return;
    }

    if (prompts.length < 3) {
      const newPrompt = { question, answer };
      setPrompts([...prompts, newPrompt]);
      setQuestion("");
      setAnswer("");
      setModalVisible(false);
    } else {
      alert("You can only select up to 3 prompts.");
    }
  };

  const removePrompt = (index) => {
    const updatedPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(updatedPrompts);
  };

  const proceedToNextScreen = () => {
    if (prompts.length > 0) {
      navigation.navigate("auth/registration/PromptScreen", {
        prompts: prompts,
      });
    } else {
      alert("Please select at least one prompt to proceed.");
    }
  };

  console.log("Selected prompts:", prompts);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#581845" }}>
            View all
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#581845" }}>
            Prompts
          </Text>
          <Entypo name="cross" size={22} color="black" />
        </View>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 20,
            flexDirection: "row",
            gap: 10,
          }}
        >
          {promptss.map((item, index) => (
            <View key={item.id}>
              <Pressable
                style={{
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: option === item.name ? "#581845" : "white",
                }}
                onPress={() => setOption(item.name)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: option === item.name ? "white" : "black",
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <ScrollView style={{ marginTop: 20, marginHorizontal: 12 }}>
          {promptss.map((item) => (
            <View key={item.id}>
              {option === item.name && (
                <View>
                  {item.questions.map((questionItem) => (
                    <Pressable
                      onPress={() => openModal(questionItem)}
                      style={{ marginVertical: 12 }}
                      key={questionItem.id}
                    >
                      <Text style={{ fontSize: 15, fontWeight: "500" }}>
                        {questionItem.question}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Display selected prompts */}
          <View style={{ marginTop: 30 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Selected Prompts:
            </Text>
            {prompts.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: "#ddd",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                  {item.question}: {item.answer}
                </Text>
                <Pressable onPress={() => removePrompt(index)}>
                  <Entypo name="cross" size={20} color="red" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>

        <Pressable
          onPress={proceedToNextScreen}
          style={{
            backgroundColor: "#581845",
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
            marginHorizontal: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Proceed</Text>
        </Pressable>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(false)}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Choose Option" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(false)}
      >
        <ModalContent style={{ width: "100%", height: 280 }}>
          <View style={{ marginVertical: 10 }}>
            <Text
              style={{ textAlign: "center", fontWeight: "600", fontSize: 15 }}
            >
              Answer your question
            </Text>
            <Text style={{ marginTop: 15, fontSize: 20, fontWeight: "600" }}>
              {question}
            </Text>
            <View
              style={{
                borderColor: "#202020",
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                height: 100,
                marginVertical: 12,
                borderStyle: "dashed",
              }}
            >
              <TextInput
                value={answer}
                onChangeText={(text) => setAnswer(text)}
                style={{
                  color: "gray",
                  width: 300,
                  fontSize: 18,
                }}
                placeholder="Enter Your Answer"
              />
            </View>
            <Button onPress={addPrompt} title="Add" />
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default ShowPromptScreen;

const styles = StyleSheet.create({});
