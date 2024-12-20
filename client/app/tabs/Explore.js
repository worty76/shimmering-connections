import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
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

const Explore = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userIndex, setUserIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [users, setUsers] = useState([]);

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

  // useEffect(() => {
  //   if (auth && userId) {
  //     fetchProfile();
  //   }
  // }, [auth, userId]);

  useFocusEffect(
    useCallback(() => {
      if (auth && userId) {
        fetchProfile();
      }
    }, [auth, userId])
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const url = `${constants.API_URL}/api/user/profiles/`;
      const params = { userId: userId };
      const res = await axios.get(url, { params });
      setUsers(res?.data?.matches || []);
      console.log(res);
      setUserIndex(0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setLoading(false);
    }
  };

  const userDislike = () => {
    nextUser();
  };

  const nextUser = () => {
    setUserIndex((prevIndex) => prevIndex + 1);
  };

  const likeProfile = async (user) => {
    try {
      const response = await axios.post(`${constants.API_URL}/api/user/like`, {
        userId: userId,
        likedUserId: user.userId,
      });
      console.log(response);
      nextUser();
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };

  const user = users && users[userIndex];

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: "#FAF9F6" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (users && userIndex >= users.length) {
    return <NoMoreMatches onReloadPress={fetchProfile} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {user && (
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
      )}
      <View style={styles.buttons}>
        <MatchButton onPress={userDislike} icon="close" iconColor="#5B93FA" />

        <MatchButton
          onPress={() => likeProfile(user)}
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
    paddingBottom: 50,
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
