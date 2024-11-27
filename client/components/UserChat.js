import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const UserChat = ({ item, userId }) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ChatRoom", {
          image: item?.imageUrls[0],
          name: item?.firstName,
          receiverId: item?._id,
          senderId: userId,
        })
      }
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.8 }]}
    >
      <Image
        style={styles.profileImage}
        source={{
          uri: item?.imageUrls[0] || "https://via.placeholder.com/70",
        }}
      />

      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item?.firstName}</Text>
        <Text style={styles.lastMessage}>
          {`Start a conversation with ${item?.firstName}`}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#FF6E6C",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  lastMessage: {
    fontSize: 15,
    color: "#777",
    marginTop: 6,
  },
});
