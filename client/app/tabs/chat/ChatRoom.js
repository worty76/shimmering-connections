import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io } from "socket.io-client";
import axios from "axios";
import constants from "../../../constants/api";

const { width, height } = Dimensions.get("window");

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { senderId, receiverId, receiverName, receiverAvatar } = route.params;
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    // Initialize Socket.IO client
    const newSocket = io(`${constants.API_URL}`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the Socket.IO server");
      newSocket.emit("joinRoom", senderId);
    });

    newSocket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [senderId]);

  useEffect(() => {
    // Fetch initial messages
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/api/chat/fetch-messages`,
        {
          params: { senderId, receiverId },
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching the messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const sendMessage = () => {
    if (socket && message.trim()) {
      const newMsg = {
        id: Date.now(), // Assuming backend provides unique IDs, else use this
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      };
      socket.emit("sendMessage", newMsg);
      setMessage("");
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      scrollToBottom();
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: "#FFF5F5" }]}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: "#FFF5F5" }]}>
        <AntDesign name="exclamationcircle" size={50} color="#DC143C" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchMessages();
          }}
          style={styles.retryButton}
          accessibilityLabel="Retry Button"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFF5F5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.goBackButton}
              accessibilityLabel="Go Back Button"
            >
              <Entypo name="chevron-left" size={30} color="#DC143C" />
            </Pressable>
            <View style={styles.receiverInfo}>
              {receiverAvatar ? (
                <Image
                  source={{ uri: receiverAvatar }}
                  style={styles.receiverAvatar}
                  accessible
                  accessibilityLabel={`${receiverName}'s avatar`}
                />
              ) : (
                <Entypo
                  name="user"
                  size={40}
                  color="#DC143C"
                  style={{ marginRight: 10 }}
                />
              )}
              <Text style={styles.headerTitle}>{receiverName}</Text>
            </View>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            ref={flatListRef}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            renderItem={({ item }) => {
              const isSent = item.senderId === senderId;
              return (
                <View
                  style={[
                    isSent
                      ? styles.sentMessageContainer
                      : styles.receivedMessageContainer,
                  ]}
                >
                  {!isSent && receiverAvatar && (
                    <Image
                      source={{ uri: receiverAvatar }}
                      style={styles.avatar}
                      accessible
                      accessibilityLabel={`${receiverName}'s avatar`}
                    />
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      isSent ? styles.sentBubble : styles.receivedBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isSent ? styles.sentText : styles.receivedText,
                      ]}
                    >
                      {item.message}
                    </Text>
                    <Text
                      style={[
                        styles.timestamp,
                        isSent
                          ? styles.sentTimestamp
                          : styles.receivedTimestamp,
                      ]}
                    >
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View style={styles.noMessagesContainer}>
                <AntDesign name="message1" size={50} color="#DC143C" />
                <Text style={styles.noMessagesText}>No messages yet.</Text>
              </View>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={(text) => setMessage(text)}
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor="#888"
              multiline
              accessibilityLabel="Message Input Field"
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButton,
                { backgroundColor: message.trim() ? "#DC143C" : "#aaa" },
              ]}
              disabled={!message.trim()}
              accessibilityLabel="Send Button"
            >
              <AntDesign name="arrowup" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  goBackButton: {
    padding: 5,
  },
  receiverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  receiverAvatar: {
    width: width * 0.1, // 10% of screen width
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  sentMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  receivedMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 5,
    alignItems: "flex-end",
  },
  avatar: {
    width: width * 0.09, // 9% of screen width
    height: width * 0.09,
    borderRadius: (width * 0.09) / 2,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  sentBubble: {
    backgroundColor: "#DC143C",
    borderTopRightRadius: 0,
    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  receivedBubble: {
    backgroundColor: "#e5e5ea",
    borderTopLeftRadius: 0,
    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sentText: {
    color: "white",
  },
  receivedText: {
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    textAlign: "right",
  },
  sentTimestamp: {
    color: "#fff",
  },
  receivedTimestamp: {
    color: "#555",
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.3,
  },
  noMessagesText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#DC143C",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 5,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    fontSize: 18,
    color: "#DC143C",
    textAlign: "center",
    marginVertical: 10,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: "#DC143C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
