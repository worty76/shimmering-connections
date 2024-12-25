import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { UserCard, MatchButton, NoMoreMatches } from "../../components";
import axios from "axios";
import constants from "../../constants/api";
import { useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const Explore = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userIndex, setUserIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [auth, setAuth] = useState(null);
  const [users, setUsers] = useState([]);
  const [applyPreferences, setApplyPreferences] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      if (auth && userId) {
        fetchProfiles();
      }
    }, [auth, userId, applyPreferences])
  );

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const url = `${constants.API_URL}/api/user/profiles/`;
      const params = {
        userId: userId,
        applyPreferences: applyPreferences ? "true" : "false",
      };
      const res = await axios.get(url, { params });
      setUsers(res?.data?.matches || []);
      setUserIndex(0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setLoading(false);
    }
  };

  const togglePreferences = () => {
    setApplyPreferences((prev) => !prev);
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

  const handleReload = () => {
    setApplyPreferences(false);
    fetchProfiles();
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: "#FAF9F6" }]}>
        <ActivityIndicator size="large" color="crimson" />
      </View>
    );
  }

  if (users && userIndex >= users.length) {
    return <NoMoreMatches onReloadPress={handleReload} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Button to toggle preferences */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => togglePreferences()}
      >
        <Icon
          name={applyPreferences ? "filter-list-off" : "filter-list"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
      {/* Button to edit preferences */}
      <TouchableOpacity
        style={styles.editPreferencesButton}
        onPress={() =>
          navigation.navigate("EditPreferencesScreen", {
            userId,
          })
        }
      >
        <Icon name="edit" size={24} color="#fff" />
      </TouchableOpacity>
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
        <MatchButton onPress={userDislike} icon="close" iconColor="crimson" />
        <MatchButton
          onPress={() => likeProfile(user)}
          icon="heart"
          iconColor="crimson"
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
    color: "crimson",
    fontSize: 28,
    fontWeight: "700",
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  filterButton: {
    position: "absolute",
    top: 16,
    right: 72,
    zIndex: 10,
    padding: 10,
    backgroundColor: "crimson",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  editPreferencesButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 10,
    backgroundColor: "crimson",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
});

export default Explore;
