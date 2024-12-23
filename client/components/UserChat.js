import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const UserChat = ({ item, userId }) => {
  const navigation = useNavigation();

  const isOnline = item.isOnline;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ChatRoom", {
          image: item?.imageUrls[0],
          name: item?.firstName,
          receiverId: item?._id,
          receiverAvatar: item.imageUrls[0],
          receiverName: item.firstName,
          senderId: userId,
        })
      }
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${item?.firstName}`}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: item?.imageUrls[0] || "https://via.placeholder.com/70",
          }}
        />
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.userName}>{item?.firstName}</Text>
          <Text style={styles.timestamp}>
            {item?.lastMessageTime ? formatTime(item.lastMessageTime) : ""}
          </Text>
        </View>
        <Text style={styles.lastMessage}>
          {item?.lastMessage
            ? item.lastMessage
            : `Start a conversation with ${item?.firstName}`}
        </Text>
      </View>
    </Pressable>
  );
};

// Helper function to format time
const formatTime = (time) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default UserChat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FF6E6C",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
});
