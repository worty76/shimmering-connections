import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io } from "socket.io-client";
import constants from "../../../constants/api";
import axios from "axios";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { senderId, receiverId } = route?.params;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`${constants.API_URL}`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the Socket.IO server");
      newSocket.emit("joinRoom", senderId);
    });

    newSocket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [senderId]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("sendMessage", { senderId, receiverId, message });
      setMessage("");
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId, receiverId, message, timestamp: new Date() },
      ]);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/api/chat/fetch-messages`,
        {
          params: { senderId, receiverId },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching the messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {messages.map((item, index) => (
          <Pressable
            key={index}
            style={[
              item?.senderId === senderId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item?.message}</Text>
            <Text style={styles.timestamp}>{formatTime(item?.timestamp)}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <Entypo style={styles.icon} name="emoji-happy" size={24} color="gray" />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.textInput}
          placeholder="Type your message..."
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#662d91",
    padding: 8,
    borderRadius: 7,
    margin: 10,
    maxWidth: "60%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#452c63",
    padding: 8,
    borderRadius: 7,
    margin: 10,
    maxWidth: "60%",
  },
  messageText: {
    fontSize: 15,
    color: "white",
  },
  timestamp: {
    fontSize: 9,
    color: "#F0F0F0",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#662d91",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default ChatRoom;
