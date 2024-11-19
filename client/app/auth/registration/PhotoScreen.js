import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from "../../../helpers/registrationUtils";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const PhotoScreen = () => {
  const navigation = useNavigation();
  const [imageUrls, setImageUrls] = useState(["", "", "", "", "", ""]);
  const [imageBlobs, setImageBlobs] = useState([]);

  useEffect(() => {
    getRegistrationProgress("Photos").then((progressData) => {
      if (progressData && progressData.imageUrls) {
        const loadedUrls =
          progressData.imageUrls.length < 6
            ? [
                ...progressData.imageUrls,
                ...new Array(6 - progressData.imageUrls.length).fill(""),
              ]
            : progressData.imageUrls;
        setImageUrls(loadedUrls);
      }
    });
  }, []);

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      console.log("Image picked:", pickedImage);

      const index = imageUrls.findIndex((url) => url === "");

      if (index !== -1) {
        const updatedUrls = [...imageUrls];
        updatedUrls[index] = pickedImage.uri;
        setImageUrls(updatedUrls);

        const updatedBlobs = [...imageBlobs];
        updatedBlobs[index] = {
          uri: pickedImage.uri,
          type: pickedImage.type || "image/jpeg",
          name: pickedImage.fileName || `upload_${Date.now()}.jpg`,
        };
        setImageBlobs(updatedBlobs);
      }
    } else {
      console.log("User canceled image picker");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = ""; // Reset the specific index to empty
    setImageUrls(updatedUrls);

    const updatedBlobs = [...imageBlobs];
    updatedBlobs[index] = null; // Remove the blob at the specific index
    setImageBlobs(updatedBlobs);
  };

  const handleNext = async () => {
    try {
      // Code for uploading images goes here...

      saveRegistrationProgress("Photos", { imageUrls });
      navigation.navigate("auth/registration/PromptScreen");
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          marginTop: 90,
          marginHorizontal: 20,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderColor: "black",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="photo-camera-back" size={22} color="black" />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            fontFamily: "GeezaPro-Bold",
            marginTop: 15,
          }}
        >
          Pick your videos and photos
        </Text>

        <View style={{ marginTop: 20 }}>
          {[0, 3].map((startIndex) => (
            <View
              key={startIndex}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 20,
                marginTop: startIndex === 3 ? 20 : 0,
              }}
            >
              {imageUrls.slice(startIndex, startIndex + 3).map((url, index) => (
                <Pressable
                  key={index}
                  onLongPress={() => handleRemoveImage(startIndex + index)}
                  style={{
                    borderColor: "#581845",
                    borderWidth: url ? 0 : 2,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    borderStyle: "dashed",
                    borderRadius: 10,
                    height: 100,
                    backgroundColor: url ? "transparent" : "#f0f0f0",
                  }}
                >
                  {url ? (
                    <Image
                      source={{ uri: url }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        resizeMode: "cover",
                      }}
                    />
                  ) : (
                    <EvilIcons name="image" size={22} color="black" />
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: "gray", fontSize: 15 }}>Drag to reorder</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#581845",
              marginTop: 3,
            }}
          >
            Add four to six photos
          </Text>
        </View>

        <View style={{ marginTop: 25 }}>
          <Text>Add a picture of yourself</Text>
          <Button onPress={handleAddImage} title="Pick Image" />
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={{ marginTop: 30, marginLeft: "auto" }}
        >
          <MaterialCommunityIcons
            name="arrow-right-circle"
            size={45}
            color="#581845"
            style={{ alignSelf: "center", marginTop: 20 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({});
