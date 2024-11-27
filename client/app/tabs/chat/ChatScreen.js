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
import { jwtDecode } from "jwt-decode";
import { useFocusEffect } from "@react-navigation/native";
import constants from "../../../constants/api";
import UserChat from "../../../components/UserChat";

const ChatScreen = () => {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    };
    fetchUser();
  }, []);

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
        <Text style={styles.sectionTitle}>Your Matches</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6E6C" />
            <Text style={styles.loadingText}>Loading your matches...</Text>
          </View>
        ) : matches.length > 0 ? (
          <FlatList
            data={matches}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <UserChat item={item} userId={userId} />}
          />
        ) : (
          <Text style={styles.emptyStateText}>
            You don't have any matches yet!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  chatList: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF6E6C",
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: "center",
    color: "#aaa",
    marginTop: 50,
  },
});
