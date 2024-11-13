import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import constants from "../../../../constants/api";
import { Entypo, FontAwesome, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";

const Profile = ({ profile, isEven, userId, setProfile, index }) => {
  const color = ["#F0F8FF", "#FFFFFF"];
  const [like, setLike] = useState(false);
  const [selected, setSelected] = useState(false);

  const handleLike = async (id) => {
    try {
      setLike(true);
      await axios.post(constants.API_URL + `send-like`, {
        currentID: userId,
        selectedId: id,
      });
      setTimeout(() => {
        setProfile((prev) => prev.filter((profile) => profile._id !== id));
      }, 200);
      setLike(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleLikeOther = async (id) => {
    try {
      setSelected(true);
      await axios.post(constants.API_URL + `send-like`, {
        currentID: userId,
        selectedId: id,
      });
      setTimeout(() => {
        setProfile((prev) => prev.filter((profile) => profile._id !== id));
      }, 200);
      setSelected(false);
    } catch (error) {
      console.error("error", error);
    }
  };
  if (isEven) {
    return (
      <View
        key={index}
        style={{
          padding: 12,
          backgroundColor: "#F0F8FF",
        }}
      >
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {profile?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 16,
                  lineHeight: 25,
                  marginBottom: 8,
                }}
              >
                {profile?.desc?.length > 160
                  ? profile?.desc
                  : profile.desc.substr(0, 160)}
              </Text>
            </View>
            {profile?.profileImages.slice(0, 1).map((image, index) => (
              <Image
                key={index}
                source={{ uri: constants.IMAGE_URL + image }}
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 5,
                  resizeMode: "cover",
                }}
              />
            ))}
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="black" />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Pressable style={styles.like}>
                <FontAwesome name="diamond" size={27} color="#FF033E" />
              </Pressable>
              {like ? (
                <Pressable style={styles.like}>
                  <Animatable.View
                    animation={"swing"}
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="#FF033E" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.like}
                  onPress={() => handleLike(profile?._id)}
                >
                  <AntDesign name="hearto" size={27} color="#FF033E" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 15 }} />
      </View>
    );
  } else {
    return (
      <View style={{ padding: 12, backgroundColor: "#FFFFFF" }} key={index}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            {profile?.profileImages.slice(0, 1).map((image, index) => (
              <Image
                key={index}
                source={{ uri: constants.IMAGE_URL + image }}
                style={{
                  width: 200,
                  height: 280,
                  borderRadius: 5,
                  resizeMode: "cover",
                }}
              />
            ))}
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {profile?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 16,
                  lineHeight: 25,
                  fontFamily: "sans-serif",
                  marginBottom: 8,
                }}
              >
                {profile?.desc?.length > 160
                  ? profile?.desc
                  : profile.desc.substr(0, 160)}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="black" />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Pressable style={styles.elLike}>
                <FontAwesome name="diamond" size={27} color="#0066b2" />
              </Pressable>
              {selected ? (
                <Pressable style={styles.elLike}>
                  <Animatable.View
                    animation={"swing"}
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="#6699CC" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleLikeOther(profile?._id)}
                  style={styles.elLike}
                >
                  <AntDesign name="hearto" size={27} color="#6699CC" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 15 }} />
      </View>
    );
  }
};

export default Profile;

const styles = StyleSheet.create({
  like: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  elLike: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
});
