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
  const [userId, setUserId] = useState("");
  const [auth, setAuth] = useState();
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
    console.log("called at fetchUser");
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const getAuth = async () => {
      try {
        const res = await axios.get(
          `${constants.API_URL}/api/user/profile/${userId}`
        );
        setAuth(res?.data?.user);
      } catch (error) {
        console.error("Interval Error Server", error);
      }
    };

    if (userId) {
      getAuth();
    } else {
      console.log("userId is not valid");
    }
  }, [userId]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch("https://api.randomuser.me/?results=5");
  //     const { results } = await response.json();
  //     setLoading(false);
  //     setUsers(results);
  //     setUserIndex(0);
  //   } catch (e) {
  //     setLoading(false);
  //     Alert.alert("Failed to load", "There was an issue loading users");
  //   }
  // };

  const fetchProfile = async () => {
    try {
      const url = `${constants.API_URL}/api/user/profiles/`;
      const params = {
        userId: userId,
        gender: auth?.gender,
        turnOns: auth?.turnOns,
        lookingFor: auth?.lookingFor,
      };
      const res = await axios.get(url, { params });
      setUsers(res?.data?.data);
      setUserIndex(0);
      console.log("called");
      console.log(users);
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() => {
    if (auth && userId) fetchProfile();
  }, [auth, userId]);

  const userLike = () => {
    nextUser();
  };

  const userDislike = () => {
    nextUser();
  };

  const userPressed = (user) => {
    navigation.navigate("UserProfile", {
      imageUrl: user.picture.large,
    });
  };

  const nextUser = () => {
    setUserIndex((prevIndex) => prevIndex + 1);
  };

  const user = users[userIndex];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (userIndex >= users.length) {
    return <NoMoreMatches onReloadPress={fetchProfile} />;
  }

  return (
    <View style={styles.container}>
      <UserCard
        onPress={() => userPressed(user)}
        imageUrl={user.picture?.large}
      />
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
          {user.name}
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
