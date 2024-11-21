import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import constants from "../../../constants/api";

const LikesScreen = () => {
  const navigation = useNavigation();
  const [option, setOption] = useState("Recent");
  const [userId, setUserId] = useState("");
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserId = async () => {
    const token = await AsyncStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
  };

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${constants.API_URL}/api/user/received-likes/${userId}`
      );
      setLikes(response.data.receivedLikes || []);
    } catch (error) {
      console.error("Error fetching received likes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchLikes();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) fetchLikes();
    }, [userId])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Likes You</Text>
          <Pressable style={styles.boostButton}>
            <SimpleLineIcons name="fire" size={24} color="white" />
            <Text style={styles.boostText}>Boost</Text>
          </Pressable>
        </View>
        <View style={styles.filters}>
          <Pressable
            onPress={() => setOption("Recent")}
            style={[
              styles.filterOption,
              option === "Recent" && styles.activeOption,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                option === "Recent" && styles.activeText,
              ]}
            >
              Recent
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setOption("Your Type")}
            style={[
              styles.filterOption,
              option === "Your Type" && styles.activeOption,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                option === "Your Type" && styles.activeText,
              ]}
            >
              Your Type
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setOption("Last Active")}
            style={[
              styles.filterOption,
              option === "Last Active" && styles.activeOption,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                option === "Last Active" && styles.activeText,
              ]}
            >
              Last Active
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setOption("Nearby")}
            style={[
              styles.filterOption,
              option === "Nearby" && styles.activeOption,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                option === "Nearby" && styles.activeText,
              ]}
            >
              Nearby
            </Text>
          </Pressable>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#008B8B" />
        ) : (
          <>
            {likes.length > 0 && (
              <Pressable
                onPress={() =>
                  navigation.navigate("tabs/profile/HandleLikeScreen", {
                    firstName: likes[0].userId?.firstName,
                    lastName: likes[0].userId?.lastName,
                    age: likes[0].userId?.age,
                    province: likes[0].userId?.province,
                    district: likes[0].userId?.district,
                    image: likes[0].image,
                    imageUrls: likes[0].userId?.imageUrls,
                    prompts: likes[0].userId?.prompts,
                    userId: userId,
                    selectedUserId: likes[0].userId?._id,
                  })
                }
                style={styles.mainLike}
              >
                <View style={styles.likeInfo}>
                  <Text>Liked your photo</Text>
                </View>
                <Text style={styles.mainName}>
                  {likes[0].userId?.firstName + " " + likes[0].userId?.lastName}
                </Text>
                <Image
                  source={{ uri: likes[0].userId?.imageUrls[0] }}
                  style={styles.mainImage}
                />
              </Pressable>
            )}
            <Text style={styles.upNextTitle}>Up Next</Text>
            <View style={styles.upNextContainer}>
              {likes.slice(1).map((like, index) => (
                <View key={index} style={styles.nextLike}>
                  {like.comment ? (
                    <View style={styles.commentBox}>
                      <Text>{like.comment}</Text>
                    </View>
                  ) : (
                    <View style={styles.likeBox}>
                      <Text>Liked your photo</Text>
                    </View>
                  )}
                  <Text style={styles.nextName}>{like.userId?.firstName}</Text>
                  <Image
                    source={{ uri: like.userId?.imageUrls[0] }}
                    style={styles.nextImage}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LikesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  scrollView: {
    marginTop: 55,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 15,
  },
  boostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#008B8B",
    padding: 10,
    borderRadius: 30,
  },
  boostText: {
    color: "white",
    fontWeight: "bold",
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  filterOption: {
    borderWidth: 0.7,
    borderColor: "#808080",
    padding: 10,
    borderRadius: 20,
  },
  activeOption: {
    backgroundColor: "black",
    borderColor: "transparent",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#808080",
  },
  activeText: {
    color: "white",
  },
  mainLike: {
    padding: 20,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 20,
  },
  likeInfo: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  mainName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  mainImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 20,
  },
  upNextTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  upNextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  nextLike: {
    backgroundColor: "white",
    marginVertical: 10,
  },
  commentBox: {
    backgroundColor: "#F5F3C6",
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  likeBox: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
  },
  nextName: {
    fontSize: 17,
    fontWeight: "500",
  },
  nextImage: {
    height: 220,
    width: 180,
    borderRadius: 4,
  },
});
