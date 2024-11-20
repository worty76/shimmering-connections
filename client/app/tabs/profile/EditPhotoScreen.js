import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import api from "../../../constants/api";

const EditPhotosScreen = ({ route, navigation }) => {
  const { currentImages, userId } = route.params;
  const [images, setImages] = useState(currentImages || []);

  const updateImage = async (index) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const updatedImages = [...images];
      updatedImages[index] = result.assets[0].uri;
      setImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  const saveImages = async () => {
    try {
      const filteredImages = images.filter((img) => img !== null);
      await axios.put(`${api.API_URL}/api/user/update-images/${userId}`, {
        imageUrls: filteredImages,
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating images:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Your Photos</Text>
      <View style={styles.imagesContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.image} />
                <Pressable
                  onPress={() => removeImage(index)}
                  style={styles.removeButton}
                >
                  <AntDesign name="closecircle" size={20} color="red" />
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => updateImage(index)}
                style={styles.addImagePlaceholder}
              >
                <AntDesign name="plus" size={30} color="#B0B0B0" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
      <Pressable onPress={saveImages} style={styles.saveButton}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default EditPhotosScreen;

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "30%",
    aspectRatio: 1,
    marginBottom: 15,
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    fontSize: 12,
    color: "#B0B0B0",
    marginTop: 5,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 2,
  },
  saveButton: {
    backgroundColor: "#008B8B",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  saveText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
