import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Image,
  Alert,
  Platform,
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
import * as FileSystem from "expo-file-system";

const PhotoScreen = () => {
  const navigation = useNavigation();
  const [imageUrls, setImageUrls] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

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

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message, [{ text: "OK", onPress: () => {} }]);
    }
  };

  const handleAddImage = async () => {
    // Request permissions
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

      if (pickedImage.uri.startsWith("file://")) {
        const base64 = await FileSystem.readAsStringAsync(pickedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const base64Image = `data:image/jpeg;base64,${base64}`;
        const index = imageUrls.findIndex((url) => url === "");
        if (index !== -1) {
          const updatedUrls = [...imageUrls];
          updatedUrls[index] = base64Image;
          setImageUrls(updatedUrls);
        } else {
          Alert.alert("Limit Reached", "You can only upload up to 6 images.");
        }
      } else {
        const base64Image = pickedImage.uri;
        const index = imageUrls.findIndex((url) => url === "");
        if (index !== -1) {
          const updatedUrls = [...imageUrls];
          updatedUrls[index] = base64Image;
          setImageUrls(updatedUrls);
        } else {
          Alert.alert("Limit Reached", "You can only upload up to 6 images.");
        }
      }
    }
  };

  const handleNext = async () => {
    if (imageUrls.filter((url) => url !== "").length < 1) {
      showAlert("Minimum Photos Required", "Please add at least four photos.");
      return;
    }

    setIsLoading(true);
    try {
      saveRegistrationProgress("Photos", { imageUrls });
      navigation.navigate("PromptScreen");
    } catch (error) {
      console.error("Error saving photos:", error);
      showAlert("Error", "Failed to save photos. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = "";
    setImageUrls(updatedUrls);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="photo-camera-back" size={22} color="black" />
          </View>
          <Image
            style={styles.logo}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/10613/10613685.png",
            }}
          />
        </View>

        <Text style={styles.titleText}>Pick your videos and photos</Text>

        <View style={styles.photoGrid}>
          {imageUrls.map((url, index) => (
            <Pressable
              key={index}
              onLongPress={() => handleRemoveImage(index)}
              style={[
                styles.photoContainer,
                url ? styles.filledPhotoContainer : styles.emptyPhotoContainer,
              ]}
            >
              {url ? (
                <Image source={{ uri: url }} style={styles.photo} />
              ) : (
                <EvilIcons name="image" size={30} color="#aaa" />
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.instructionText}>Drag to reorder photos</Text>
        <Text style={styles.subInstructionText}>
          Add four to six photos to complete your profile.
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
          <Text style={styles.addButtonText}>Add Photos</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#581845"
            style={styles.loader}
          />
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={styles.nextButton}
          >
            <MaterialCommunityIcons
              name="arrow-right-circle"
              size={45}
              color="#581845"
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    marginTop: 90,
    marginHorizontal: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  photoGrid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  photoContainer: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filledPhotoContainer: {
    borderWidth: 0,
  },
  emptyPhotoContainer: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    backgroundColor: "#f9f9f9",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  instructionText: {
    color: "gray",
    fontSize: 14,
    marginTop: 10,
  },
  subInstructionText: {
    color: "#581845",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#581845",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    marginTop: 30,
    alignSelf: "flex-end",
  },
  loader: {
    marginTop: 30,
  },
});
