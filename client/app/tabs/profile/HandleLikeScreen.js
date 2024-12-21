import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import constants from "../../../constants/api";
import CustomModal from "../../../components/CustomModal"; // Ensure the path is correct

const screenWidth = Dimensions.get("window").width;

const HandleLikeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Function to handle match creation
  const handleMatch = async () => {
    try {
      console.log("Handle match called");
      const currentUserId = route.params?.userId;
      const selectedUserId = route.params?.selectedUserId;

      if (!currentUserId || !selectedUserId) {
        console.error("Missing userId or selectedUserId");
        closeModal();
        return;
      }

      const response = await axios.post(
        `${constants.API_URL}/api/user/create-match`,
        {
          currentUserId,
          selectedUserId,
        }
      );

      if (response.status === 200) {
        console.log("Match created successfully");
        closeModal();
        navigation.goBack();
      } else {
        console.error("Failed to create a match");
        closeModal();
      }
    } catch (error) {
      console.error("Error creating match:", error);
      closeModal();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.goBackContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text style={styles.goBackText}>Go Back</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={styles.container}>
        {/* Carousel */}
        {route?.params?.imageUrls?.length > 0 ? (
          <Carousel
            loop
            width={screenWidth - 24}
            height={350}
            autoPlay
            data={route?.params?.imageUrls.filter((img) => img !== "")}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View style={styles.carouselContainer}>
                <Image style={styles.carouselImage} source={{ uri: item }} />
              </View>
            )}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              No images available for this profile.
            </Text>
          </View>
        )}

        {/* Profile Information */}
        <View style={styles.additionalInfo}>
          <Text style={styles.profileName}>
            {route?.params?.firstName} {route?.params?.lastName}
          </Text>
          {route?.params?.bio && (
            <Text style={styles.infoText}>Bio: {route?.params?.bio}</Text>
          )}
          {route?.params?.age && (
            <Text style={styles.infoText}>Age: {route?.params?.age}</Text>
          )}
          {route?.params?.gender && (
            <Text style={styles.infoText}>Gender: {route?.params?.gender}</Text>
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

        {/* Prompts */}
        {route?.params?.prompts?.length > 0 ? (
          route?.params?.prompts.map((prompt, index) => (
            <View key={index} style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{prompt.question}</Text>
              <Text style={styles.promptAnswer}>{prompt.answer}</Text>
            </View>
          ))
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              This user hasn't answered any prompts yet.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Match Button */}
      <Pressable onPress={openModal} style={styles.matchButton}>
        <AntDesign name="heart" size={30} color="red" />
      </Pressable>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title="Match Confirmation"
        message={`Do you want to match with ${route.params?.firstName}?`}
        confirmText="Yes"
        cancelText="No"
        onConfirm={handleMatch}
        onCancel={closeModal}
      />
    </SafeAreaView>
  );
};

export default HandleLikeScreen;

const styles = StyleSheet.create({
  goBackContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  goBackText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  container: {
    flex: 1,
    marginHorizontal: 12,
  },
  carouselContainer: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 10,
  },
  placeholderContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  additionalInfo: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  promptCard: {
    backgroundColor: "#f7f7f7",
    padding: 16,
    borderRadius: 10,
    height: 150,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 10,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#452c63",
  },
  promptAnswer: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  matchButton: {
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
    zIndex: 10,
  },
});
