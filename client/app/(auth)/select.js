import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "expo-router";
import api from "../../constants/api";

const select = () => {
  const router = useRouter();
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId);
  };

  const onPressHandler = async () => {
    try {
      const baseUrl = api.API_URL + `/api/auth/${userId}/gender`;
      const res = await axios.put(baseUrl, { gender: option });
      if (res.status !== 200) {
        alert("Error updating");
        return;
      }
      router.replace("/(tabs)/bio");
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 12,
      }}
    >
      <Pressable
        onPress={() => setOption("male")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 6,
          borderColor: option === "male" ? "green" : "transparent",
          borderWidth: option === "male" ? 1 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          I am a Man
        </Text>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
          style={{ width: 50, height: 50 }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("female")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 6,
          borderColor: option === "female" ? "green" : "transparent",
          borderWidth: option === "female" ? 1 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          I am a Women
        </Text>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/9844/9844179.png",
          }}
          style={{ width: 50, height: 50 }}
        />
      </Pressable>
      <Pressable
        onPress={() => setOption("non-binary")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 6,
          borderColor: option === "non-binary" ? "green" : "transparent",
          borderWidth: option === "non-binary" ? 1 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          I am a Non-Binary
        </Text>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/12442/12442425.png",
          }}
          style={{ width: 50, height: 50 }}
        />
      </Pressable>
      {option && (
        <Pressable
          onPress={onPressHandler}
          style={{
            marginTop: 25,
            backgroundColor: "black",
            padding: 12,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "600",
              color: "white",
            }}
          >
            Continue
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default select;

const styles = StyleSheet.create({});
