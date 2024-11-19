import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import constants from "../../../constants/api";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const ProfileDetailsScreen = () => {
  const route = useRoute();
  const { profileId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(
          `${constants.API_URL}/api/user/profile/${profileId}`
        );
        setProfile(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [profileId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#452c63" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 55 }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileName}>{profile.firstName}</Text>
              <View style={styles.newBadge}>
                <Text style={styles.badgeText}>new here</Text>
              </View>
            </View>
          </View>

          {profile.imageUrls?.length > 0 && (
            <Carousel
              loop
              width={width - 24}
              height={350}
              autoPlay={true}
              data={profile.imageUrls}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <View style={styles.carouselContainer}>
                  <Image style={styles.carouselImage} source={{ uri: item }} />
                </View>
              )}
            />
          )}

          {profile.prompts?.map((prompt, index) => (
            <View key={index} style={styles.promptContainer}>
              <View style={styles.promptCard}>
                <Text style={styles.promptQuestion}>{prompt.question}</Text>
                <Text style={styles.promptAnswer}>{prompt.answer}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  container: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  newBadge: {
    backgroundColor: "#452c63",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 10,
  },
  badgeText: {
    textAlign: "center",
    color: "white",
    fontSize: 12,
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
  imageIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "white",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promptContainer: {
    marginVertical: 15,
  },
  promptCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    height: 150,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
});
