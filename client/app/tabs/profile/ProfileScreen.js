import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import constants from "../../../constants/api";
import Profile from "./components/Profile";

const profile = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${constants.API_URL}/api/user/profile/${userId}`
        );
        setUser(res?.data?.user);
      } catch (error) {
        console.error("Interval Error Server", error);
      }
    };

    if (userId) getUser();
  }, [userId]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = `${constants.API_URL}/api/user/profiles/`;
        const params = {
          userId: userId,
          gender: user?.gender,
          turnOns: user?.turnOns,
          lookingFor: user?.lookingFor,
        };
        const res = await axios.get(url, { params });
        setProfile(res?.data?.data);
      } catch (error) {
        console.error("Interval Error Server", error);
      }
    };
    if (user && userId) fetchProfile();
  }, [user, userId]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={profile}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            No Profiles Found
          </Text>
        )}
        renderItem={({ item, index }) => (
          <Profile
            index={index}
            profile={item}
            userId={userId}
            setProfile={setProfile}
            isEven={index % 2 == 0}
          />
        )}
      />
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
