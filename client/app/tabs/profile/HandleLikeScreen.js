import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import constants from "../../../constants/api";
import CustomModal from "../../../components/CustomModal"; // Ensure the path is correct

const { width } = Dimensions.get("window");

const HandleLikeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    profileId,
    userId,
    selectedUserId,
    firstName,
    lastName,
    imageUrls,
    bio,
    age,
    gender,
    province,
    district,
    prompts,
  } = route.params;

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  // Function to handle match creation
  const handleMatch = async () => {
    try {
      console.log("Handle match called");

      if (!userId || !selectedUserId) {
        console.error("Missing userId or selectedUserId");
        closeModal();
        return;
      }

      const response = await axios.post(
        `${constants.API_URL}/api/user/create-match`,
        {
          currentUserId: userId,
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
    <SafeAreaView style={{ backgroundColor: "#FFF5F5", flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
          accessibilityLabel="Go Back Button"
        >
          <AntDesign name="arrowleft" size={24} color="#DC143C" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView>
        <View style={styles.container}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Text style={styles.profileName}>
              {firstName + " " + (lastName || "")}
            </Text>
            <View style={styles.newBadge}>
              <Text style={styles.badgeText}>New Here</Text>
            </View>
          </View>

          {/* Carousel */}
          {imageUrls?.length > 0 ? (
            <Carousel
              loop
              width={width - 24}
              height={350}
              autoPlay={true}
              data={imageUrls.filter((img) => img !== "")}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <View style={styles.carouselContainer}>
                  <Image style={styles.carouselImage} source={{ uri: item }} />
                </View>
              )}
              pagingEnabled
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                No images available for this profile.
              </Text>
            </View>
          )}

          {/* Additional Information */}
          <View style={styles.additionalInfo}>
            {bio && <Text style={styles.infoText}>Bio: {bio}</Text>}
            {age && <Text style={styles.infoText}>Age: {age}</Text>}
            {gender && <Text style={styles.infoText}>Gender: {gender}</Text>}
            {province && (
              <Text style={styles.infoText}>Province: {province}</Text>
            )}
            {district && (
              <Text style={styles.infoText}>District: {district}</Text>
            )}
          </View>

          {/* Prompts */}
          {prompts?.length > 0 ? (
            prompts.map((prompt, index) => (
              <View key={index} style={styles.promptContainer}>
                <View style={styles.promptCard}>
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                  <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                This user hasn't answered any prompts yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Match Button */}
      <Pressable onPress={openModal} style={styles.matchButton}>
        <AntDesign name="heart" size={30} color="red" />
      </Pressable>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        title="Match Confirmation"
        message={`Do you want to match with ${firstName}?`}
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF5F5",
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  newBadge: {
    backgroundColor: "#DC143C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 10,
  },
  badgeText: {
    textAlign: "center",
    color: "white",
    fontSize: 12,
    fontWeight: "600",
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
    color: "#DC143C",
    textAlign: "center",
  },
  additionalInfo: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  promptContainer: {
    marginVertical: 15,
  },
  promptCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#DC143C",
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#DC143C",
  },
  promptAnswer: {
    fontSize: 16,
    fontWeight: "500",
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
