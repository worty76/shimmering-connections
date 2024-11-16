import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserCard, MatchButton, NoMoreMatches } from "../../components";
import axios from "axios";
import { Colors } from "../../constants";
import constants from "../../constants/api";
import * as Animatable from "react-native-animatable";

const Explore = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userIndex, setUserIndex] = useState(0);
  const [userId, setUserId] = useState(null); // Ensure it's null initially
  const [auth, setAuth] = useState(null); // Ensure it's null initially
  const [users, setUsers] = useState([]);

  // Fetch userId from AsyncStorage
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch user data after userId is available
  useEffect(() => {
    if (userId) {
      const getAuth = async () => {
        try {
          const res = await axios.get(
            `${constants.API_URL}/api/user/profile/${userId}`
          );
          setAuth(res?.data?.user);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      getAuth();
    }
  }, [userId]);

  // Fetch user profiles once auth and userId are available
  useEffect(() => {
    if (auth && userId) {
      fetchProfile();
    }
  }, [auth, userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const url = `${constants.API_URL}/api/user/profiles/`;
      const params = { userId: userId };
      const res = await axios.get(url, { params });
      setUsers(res?.data?.matches || []);
      setUserIndex(0); // Reset the user index to 0 after fetching users
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setLoading(false);
    }
  };

  // Handle user actions (like/dislike)
  const userLike = () => {
    nextUser();
  };

  const userDislike = () => {
    nextUser();
  };

  const userPressed = (user) => {
    // Navigate to UserProfile screen with the current image URL
    navigation.navigate("UserProfile", {
      imageUrls: user.imageUrls, // Pass the whole array of image URLs
      currentImageIndex: userIndex, // Pass the current image index to show the current image
    });
  };

  const nextUser = () => {
    setUserIndex((prevIndex) => prevIndex + 1); // Move to the next user
  };

  const user = users && users[userIndex]; // Get the user based on the current index

  // Loading state
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // No more users available
  if (users && userIndex >= users.length) {
    return <NoMoreMatches onReloadPress={fetchProfile} />;
  }

  return (
    <View style={styles.container}>
      {user && (
        <UserCard
          onPress={() =>
            navigation.navigate("UserProfile", { userId: user.id })
          }
          imageUrls={user.imageUrls}
        />
      )}
      <View style={styles.buttons}>
        <MatchButton
          onPress={userDislike}
          icon="md-close"
          iconColor="#5B93FA"
        />
        <Animatable.Text
          animation="bounceIn"
          delay={750}
          duration={500}
          style={styles.name}
        >
          {user && user.firstName}
        </Animatable.Text>
        <MatchButton
          onPress={userLike}
          icon="ios-heart"
          iconColor={Colors.primaryColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    position: "relative",
    backgroundColor: "#F8F8F9",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  name: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});

export default Explore;
