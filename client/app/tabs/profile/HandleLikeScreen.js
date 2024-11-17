import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions, Image } from "react-native";
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
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.likesCount}>All {route?.params?.likes}</Text>
          <Text style={styles.backText} onPress={() => navigation.goBack()}>
            Back
          </Text>
        </View>

        {route?.params?.imageUrls?.length > 0 && (
          <Carousel
            width={screenWidth}
            height={350}
            data={route?.params?.imageUrls}
            renderItem={({ item }) => (
              <Image style={styles.profileImage} source={{ uri: item }} />
            )}
          />
        )}

        <View style={styles.detailsContainer}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileName}>{route?.params?.name}</Text>
            <View style={styles.newTag}>
              <Text style={styles.newTagText}>new here</Text>
            </View>
          </View>
          <Entypo name="dots-three-horizontal" size={22} color="black" />
        </View>

        {route?.params?.prompts?.slice(0, 3).map((prompt, index) => (
          <View key={index} style={styles.promptCard}>
            <Text style={styles.promptQuestion}>{prompt.question}</Text>
            <Text style={styles.promptAnswer}>{prompt.answer}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable onPress={match} style={styles.messageButton}>
        <AntDesign name="heart" size={30} color="red" />
      </Pressable>
    </>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 55,
  },
  likesCount: {
    fontSize: 15,
    fontWeight: "500",
  },
  backText: {
    fontSize: 15,
    fontWeight: "500",
    color: "blue",
  },
  profileImage: {
    width: "100%",
    height: 350,
    borderRadius: 10,
    resizeMode: "cover",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  newTag: {
    backgroundColor: "#452c63",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  newTagText: {
    color: "white",
    textAlign: "center",
  },
  promptCard: {
    backgroundColor: "white",
    padding: 12,
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
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
  },
  heartButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 6,
  },
  messageButton: {
    position: "absolute",
    bottom: 45,
    right: 12,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
