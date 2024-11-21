import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import constants from "../../../constants/api";

const screenWidth = Dimensions.get("window").width;

const HandleLikeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const createMatch = async () => {
    try {
      const currentUserId = route?.params?.userId;
      const selectedUserId = route?.params?.selectedUserId;
      const response = await axios.post(
        `${constants.API_URL}/api/user/create-match`,
        {
          currentUserId,
          selectedUserId,
        }
      );

      if (response.status === 200) {
        Alert.alert("It's a match!", `You matched with ${route?.params?.name}`);
        navigation.goBack();
      } else {
        console.error("Failed to create match");
      }
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const match = () => {
    if (Platform.OS === "ios") {
      Alert.alert(`Match with ${route?.params?.name}?`, ``, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: createMatch },
      ]);
    } else {
      createMatch();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
      </View>

      <ScrollView style={styles.container}>
        {route?.params?.imageUrls?.length > 0 && (
          <Carousel
            width={screenWidth}
            height={350}
            data={route?.params?.imageUrls.filter((img) => img !== "")}
            renderItem={({ item }) => (
              <Image style={styles.profileImage} source={{ uri: item }} />
            )}
            loop
          />
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.profileName}>
            {route?.params?.firstName + " " + route?.params?.lastName}
          </Text>
          <Text style={styles.bio}>
            {route?.params?.bio || "No bio provided."}
          </Text>
          <View style={styles.additionalInfo}>
            {route?.params?.age && (
              <Text style={styles.infoText}>Age: {route?.params?.age}</Text>
            )}
            {route?.params?.gender && (
              <Text style={styles.infoText}>
                Gender: {route?.params?.gender}
              </Text>
            )}
            {route?.params?.province && (
              <Text style={styles.infoText}>
                Province: {route?.params?.province}
              </Text>
            )}
            {route?.params?.district && (
              <Text style={styles.infoText}>
                District: {route?.params?.district}
              </Text>
            )}
          </View>
        </View>

        {route?.params?.prompts?.length > 0 ? (
          route?.params?.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noPromptsText}>
            This user hasn't answered any prompts yet.
          </Text>
        )}
      </ScrollView>

      <Pressable onPress={match} style={styles.messageButton}>
        <AntDesign name="heart" size={30} color="red" />
      </Pressable>
    </View>
  );
};

export default HandleLikeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  goBackButton: {
    padding: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  likesCount: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  profileImage: {
    width: "100%",
    height: 350,
    borderRadius: 10,
    resizeMode: "cover",
    marginVertical: 10,
  },
  detailsContainer: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  additionalInfo: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  promptCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    height: 150,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promptQuestion: {
    fontSize: 15,
    fontWeight: "500",
  },
  promptAnswer: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  noPromptsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  messageButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
