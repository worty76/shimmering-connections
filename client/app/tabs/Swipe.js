import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserCard, MatchButton, NoMoreMatches } from "../../components";
import axios from "axios";
import Colors from "../../constants/colors";
import constants from "../../constants/api";
import { useFocusEffect } from "expo-router";
import Swiper from "react-native-deck-swiper"; // Import the swiper library

const Explore = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch the logged-in user ID from the JWT token
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

  // Fetch the user profile
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

  // Fetch the profiles to display
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const url = `${constants.API_URL}/api/user/profiles/`;
      const params = { userId: userId };
      const res = await axios.get(url, { params });
      setUsers(res?.data?.matches || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (auth && userId) {
        fetchProfile();
      }
    }, [auth, userId])
  );

  const likeProfile = async (user) => {
    try {
      await axios.post(`${constants.API_URL}/api/user/like`, {
        userId: userId,
        likedUserId: user.userId,
      });
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };

  const userDislike = () => {
    console.log("User disliked the profile");
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  if (users && users.length === 0) {
    return <NoMoreMatches onReloadPress={fetchProfile} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.swiperWrapper}>
        <Swiper
          containerStyle={styles.swiperContainer}
          cardStyle={styles.card}
          cards={users}
          renderCard={(user) => (
            <View style={styles.cardContent}>
              <UserCard
                onPress={() =>
                  navigation.navigate("ProfileDetailsScreen", {
                    profileId: user.userId,
                  })
                }
                imageUrls={user.imageUrls.filter((img) => img !== "")}
                userInfo={{
                  firstName: user.firstName,
                  age: user.dateOfBirth,
                  province: user.province,
                  district: user.district,
                }}
              />
            </View>
          )}
          onSwipedRight={(cardIndex) => likeProfile(users[cardIndex])}
          onSwipedLeft={userDislike}
          onSwipedAll={() => console.log("No more users to swipe")}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={3}
        />
      </View>
      <View style={styles.buttons}>
        <MatchButton onPress={userDislike} icon="close" iconColor="#5B93FA" />
        <MatchButton
          onPress={() => likeProfile(users[0])}
          icon="heart"
          iconColor={Colors.primaryColor}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  swiperWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  swiperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF9F6",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
});

export default Explore;
