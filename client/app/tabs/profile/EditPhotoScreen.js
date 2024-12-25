import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { EvilIcons, AntDesign } from "@expo/vector-icons"; // Imported AntDesign
import axios from "axios";
import api from "../../../constants/api";

const EditPhotosScreen = ({ route, navigation }) => {
  const { currentImages, userId } = route.params;
  const [removedImages, setRemovedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(
    currentImages.length < 6
      ? [...currentImages, ...new Array(6 - currentImages.length).fill("")]
      : currentImages
  );
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera roll permissions to proceed."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      const fileUri = pickedImage.uri;

      try {
        let base64Image;

        if (Platform.OS === "android" && fileUri.startsWith("file://")) {
          // Convert Android file URI to base64
          const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          base64Image = `data:image/jpeg;base64,${base64}`;
        } else {
          // For iOS and Web
          base64Image = pickedImage.uri;
        }

        const index = imageUrls.findIndex((url) => url === "");
        if (index !== -1) {
          const updatedUrls = [...imageUrls];
          updatedUrls[index] = base64Image;
          setImageUrls(updatedUrls);
        } else {
          Alert.alert("Limit Reached", "You can only upload up to 6 images.");
        }
      } catch (error) {
        console.error("Error processing image:", error);
        showAlert("Error", "Failed to process the selected image.");
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedUrls = [...imageUrls];
    const removedImage = updatedUrls[index];
    updatedUrls[index] = "";
    setImageUrls(updatedUrls);

    if (removedImage) {
      setRemovedImages((prev) => [...prev, removedImage]);
    }
    console.log("Removed image:", removedImage);
  };

  const saveImages = async () => {
    const filteredImages = imageUrls.filter((url) => url !== "");
    if (filteredImages.length < 1) {
      showAlert("Minimum Photos Required", "Please add at least one photo.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      filteredImages.forEach((image) => {
        formData.append("imageUrls", image);
      });

      formData.append("removedImages", JSON.stringify(removedImages));
      formData.append("userId", userId);

      console.log(formData);

      const response = await axios.put(
        `${api.API_URL}/api/user/update-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const { updatedImages } = response.data;

        setImageUrls([
          ...updatedImages,
          ...new Array(6 - updatedImages.length).fill(""),
        ]);
        showAlert("Success", "Images updated successfully!");
      } else {
        showAlert("Error", "Failed to update images. Please try again.");
      }
    } catch (error) {
      console.error("Error updating images:", error);
      showAlert("Error", "An error occurred while updating images.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go Back Button"
        >
          <AntDesign name="arrowleft" size={24} color="#DC143C" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Edit Your Photos</Text>

        <View style={styles.photoGrid}>
          {imageUrls.map((url, index) => (
            <View key={index} style={styles.photoWrapper}>
              {url ? (
                <>
                  <Image source={{ uri: url }} style={styles.photo} />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(index)}
                    style={styles.removeIconWrapper}
                    accessibilityLabel={`Remove photo ${index + 1}`}
                  >
                    <EvilIcons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleAddImage}
                  style={styles.emptyPhotoContainer}
                  accessibilityLabel={`Add photo ${index + 1}`}
                >
                  <EvilIcons name="image" size={30} color="#DC143C" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddImage}
          accessibilityLabel="Add Photo Button"
        >
          <Text style={styles.addButtonText}>Add Photo</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#DC143C"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity
            onPress={saveImages}
            style={styles.saveButton}
            disabled={isLoading}
            accessibilityLabel="Save Changes Button"
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default EditPhotosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF5F5",
    display: "flex",
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  goBackText: {
    color: "#DC143C",
    fontSize: 16,
    marginLeft: 5,
  },
  content: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#DC143C",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  photoWrapper: {
    position: "relative",
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#DC143C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeIconWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(220, 20, 60, 0.8)",
    borderRadius: 18,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPhotoContainer: {
    backgroundColor: "#FFECEC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#DC143C",
    width: "100%",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButton: {
    backgroundColor: "#DC143C",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#DC143C",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});
