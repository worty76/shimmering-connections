import { useFocusEffect } from "@react-navigation/native"; // Import the useFocusEffect hook
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import constants from "../../../constants/api";
import { jwtDecode } from "jwt-decode";

const LikesScreen = () => {
  const navigation = useNavigation();
  const [option, setOption] = useState("Recent");
  const [userId, setUserId] = useState("");
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    };
    fetchUserId();
  }, []);

  // This effect will refetch the likes data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
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

      if (userId) fetchLikes();

      return () => {
        // Cleanup if needed (this effect doesn't require cleanup)
      };
    }, [userId]) // Re-run this effect whenever userId changes
  );

  const renderCard = (like) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HandleLikeScreen", {
          userId: userId,
          selectedUserId: like.userId?._id,
          firstName: like.userId?.firstName,
          lastName: like.userId?.lastName,
          imageUrls: like.userId?.imageUrls,
          bio: like.userId?.bio,
          age: like.userId?.age,
          gender: like.userId?.gender,
          province: like.userId?.province,
          district: like.userId?.district,
          prompts: like.userId?.prompts,
        })
      }
      style={styles.card}
    >
      <Image
        source={{ uri: like.userId?.imageUrls[0] }}
        style={styles.cardImage}
      />
      <View style={styles.cardDetails}>
        <Text style={styles.cardName}>
          {like.userId?.firstName} {like.userId?.lastName}
        </Text>
        <Text style={styles.cardComment}>
          {like.comment || "Liked your photo"}
        </Text>
        <View style={styles.cardActions}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="heart" size={20} color="#DC143C" />
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Likes You</Text>
        <Pressable style={styles.boostButton}>
          <SimpleLineIcons name="fire" size={20} color="#fff" />
          <Text style={styles.boostText}>Boost</Text>
        </Pressable>
      </View>
      <View style={styles.filterContainer}>
        {["Recent", "Your Type", "Last Active", "Nearby"].map((filter) => (
          <Pressable
            key={filter}
            onPress={() => setOption(filter)}
            style={[
              styles.filterButton,
              option === filter && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                option === filter && styles.filterActiveText,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : likes.length > 0 ? (
        <FlatList
          data={likes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderCard(item)}
          contentContainerStyle={styles.cardContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image style={styles.emptyImage} />
          <Text style={styles.emptyText}>No one has liked you yet!</Text>
          <Pressable style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Boost Your Profile</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LikesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#DC143C",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  boostButton: {
    flexDirection: "row",
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 20,
  },
  boostText: {
    color: "#fff",
    marginLeft: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  filterActive: {
    backgroundColor: "#DC143C",
  },
  filterText: {
    color: "#808080",
  },
  filterActiveText: {
    color: "#fff",
  },
  cardContainer: {
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 5,
    overflow: "hidden",
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  cardDetails: {
    flex: 1,
    padding: 15,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardComment: {
    color: "#808080",
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F8F8F8",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    color: "#808080",
    fontSize: 16,
    marginBottom: 10,
  },
  emptyButton: {
    backgroundColor: "#DC143C",
    padding: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#808080",
    fontSize: 16,
  },
});
