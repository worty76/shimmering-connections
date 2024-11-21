import React, { useEffect, useState } from "react";
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
import axios from "axios";
import constants from "../../../constants/api";
import Carousel from "react-native-reanimated-carousel";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width } = Dimensions.get("window");

const ProfileDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
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
      <View style={[styles.loading, { backgroundColor: "#fff" }]}>
        <ActivityIndicator size="large" color="#452c63" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: "#fff" }]}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={styles.goBackContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.goBackButton}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text style={styles.goBackText}>Go Back</Text>
        </Pressable>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileName}>
                {profile.firstName + " " + (profile.lastName || "")}
              </Text>
              <View style={styles.newBadge}>
                <Text style={styles.badgeText}>New Here</Text>
              </View>
            </View>
          </View>

          {profile.imageUrls?.length > 0 ? (
            <Carousel
              loop
              width={width - 24}
              height={350}
              autoPlay={true}
              data={profile.imageUrls.filter((img) => img !== "")}
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

          <View style={styles.additionalInfo}>
            {profile.bio && (
              <Text style={styles.infoText}>Bio: {profile.bio}</Text>
            )}
            {profile.age && (
              <Text style={styles.infoText}>Age: {profile.age}</Text>
            )}
            {profile.gender && (
              <Text style={styles.infoText}>Gender: {profile.gender}</Text>
            )}
            {profile.province && (
              <Text style={styles.infoText}>Province: {profile.province}</Text>
            )}
            {profile.district && (
              <Text style={styles.infoText}>District: {profile.district}</Text>
            )}
          </View>

          {profile.prompts?.length > 0 ? (
            profile.prompts.map((prompt, index) => (
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
    </SafeAreaView>
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
    fontSize: 28,
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
    color: "#888",
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
});
