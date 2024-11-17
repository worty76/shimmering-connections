import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import constants from "../../../constants/api";

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
        console.log(response);
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
        <ActivityIndicator size="large" />
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
        <View style={{ marginHorizontal: 12, marginVertical: 12 }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  {profile.firstName}
                </Text>
                <View
                  style={{
                    backgroundColor: "#452c63",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    new here
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <AntDesign name="hearto" size={22} color="black" />
              </View>
            </View>

            <View style={{ marginVertical: 15 }}>
              {profile.imageUrls?.length > 0 && (
                <View>
                  <Image
                    style={{
                      width: "100%",
                      height: 350,
                      resizeMode: "cover",
                      borderRadius: 10,
                    }}
                    source={{
                      uri: profile.imageUrls[0],
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      backgroundColor: "white",
                      width: 42,
                      height: 42,
                      borderRadius: 21,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign name="hearto" size={25} color="#C5B358" />
                  </View>
                </View>
              )}
            </View>

            {profile.prompts?.slice(0, 1).map((prompt, index) => (
              <View key={index} style={{ marginVertical: 15 }}>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 12,
                    borderRadius: 10,
                    height: 150,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "500" }}>
                    {prompt.question}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      marginTop: 20,
                    }}
                  >
                    {prompt.answer}
                  </Text>
                </View>
              </View>
            ))}

            {profile.imageUrls?.slice(1, 3).map((item, index) => (
              <View key={index} style={{ marginVertical: 10 }}>
                <Image
                  style={{
                    width: "100%",
                    height: 350,
                    resizeMode: "cover",
                    borderRadius: 10,
                  }}
                  source={{
                    uri: item,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "white",
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={25} color="#C5B358" />
                </View>
              </View>
            ))}

            <View style={{ marginVertical: 15 }}>
              {profile.prompts?.slice(1, 2).map((prompt, index) => (
                <View key={index}>
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 12,
                      borderRadius: 10,
                      height: 150,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {prompt.question}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "600",
                        marginTop: 20,
                      }}
                    >
                      {prompt.answer}
                    </Text>
                  </View>
                  <View
                    style={{
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
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <AntDesign name="hearto" size={25} color="#C5B358" />
                  </View>
                </View>
              ))}
            </View>

            {profile.imageUrls?.slice(3, 4).map((item, index) => (
              <View key={index} style={{ marginVertical: 10 }}>
                <Image
                  style={{
                    width: "100%",
                    height: 350,
                    resizeMode: "cover",
                    borderRadius: 10,
                  }}
                  source={{
                    uri: item,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "white",
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={25} color="#C5B358" />
                </View>
              </View>
            ))}

            <View style={{ marginVertical: 15 }}>
              {profile.prompts?.slice(2, 3).map((prompt, index) => (
                <View key={index}>
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 12,
                      borderRadius: 10,
                      height: 150,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {prompt.question}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "600",
                        marginTop: 20,
                      }}
                    >
                      {prompt.answer}
                    </Text>
                  </View>
                  <View
                    style={{
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
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  >
                    <AntDesign name="hearto" size={25} color="#C5B358" />
                  </View>
                </View>
              ))}
            </View>

            {profile.imageUrls?.slice(4, 7).map((item, index) => (
              <View key={index} style={{ marginVertical: 10 }}>
                <Image
                  style={{
                    width: "100%",
                    height: 350,
                    resizeMode: "cover",
                    borderRadius: 10,
                  }}
                  source={{
                    uri: item,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "white",
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={25} color="#C5B358" />
                </View>
              </View>
            ))}
          </View>
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
});
