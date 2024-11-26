import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Fix import capitalization
import { useFocusEffect } from "@react-navigation/native";
import constants from "../../../constants/api";
import UserChat from "../../../components/UserChat";

const ChatScreen = () => {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch logged-in user ID
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    };
    fetchUser();
  }, []);

  // Fetch matches
  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${constants.API_URL}/api/user/get-matches/${userId}`
      );
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMatches();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchMatches();
      }
    }, [userId])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatList}>
        <Text style={styles.sectionTitle}>Messages</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6E6C" />
        ) : matches.length > 0 ? (
          <FlatList
            data={matches}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <UserChat item={item} userId={userId} />}
          />
        ) : (
          <Text style={styles.emptyStateText}>No messages yet!</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  chatList: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    color: "#aaa",
    marginTop: 30,
  },
});
