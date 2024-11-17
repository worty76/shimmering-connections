import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import constants from "../../../../constants/api";
import { Entypo, FontAwesome, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";

const Profile = ({ profile, isEven, userId, setProfile, index }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [filterCriteria, setFilterCriteria] = useState("");

  const handleEditProfile = async () => {
    try {
      await axios.put(
        constants.API_URL + `update-profile/${userId}`,
        updatedProfile
      );
      setEditMode(false);
      // Optionally refresh or notify profile change
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
    // Implement filter logic based on `criteria` to filter the list of profiles
  };

  return (
    <View
      key={index}
      style={{
        padding: 12,
        backgroundColor: isEven ? "#F0F8FF" : "#FFFFFF",
      }}
    >
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
          {profile?.imageUrls?.slice(0, 1).map((image, index) => (
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
          <View>
            {!editMode ? (
              <>
                <Text style={{ fontSize: 18, fontWeight: "600" }}>
                  {profile?.firstName} {profile?.lastName}
                </Text>
                <Text
                  style={{ marginTop: 5, fontSize: 16, fontStyle: "italic" }}
                >
                  {profile?.gender}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 16 }}>
                  {profile?.dateOfBirth}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 16 }}>
                  Hometown: {profile?.hometown}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 16 }}>
                  Looking for: {profile?.lookingFor}
                </Text>
                <View style={{ marginTop: 10 }}>
                  {profile?.prompts?.map((prompt, index) => (
                    <View key={index} style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                        {prompt.question}
                      </Text>
                      <Text style={{ fontSize: 14 }}>{prompt.answer}</Text>
                    </View>
                  ))}
                </View>
                <Pressable
                  onPress={() => setEditMode(true)}
                  style={styles.editButton}
                >
                  <Text style={{ color: "#fff" }}>Edit Profile</Text>
                </Pressable>
              </>
            ) : (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={updatedProfile.firstName}
                  onChangeText={(text) =>
                    setUpdatedProfile({ ...updatedProfile, firstName: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={updatedProfile.lastName}
                  onChangeText={(text) =>
                    setUpdatedProfile({ ...updatedProfile, lastName: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hometown"
                  value={updatedProfile.hometown}
                  onChangeText={(text) =>
                    setUpdatedProfile({ ...updatedProfile, hometown: text })
                  }
                />
                <Pressable
                  onPress={handleEditProfile}
                  style={styles.saveButton}
                >
                  <Text style={{ color: "#fff" }}>Save Changes</Text>
                </Pressable>
                <Pressable
                  onPress={() => setEditMode(false)}
                  style={styles.cancelButton}
                >
                  <Text style={{ color: "#fff" }}>Cancel</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by criteria (e.g., gender, looking for)"
          value={filterCriteria}
          onChangeText={handleFilterChange}
        />
      </View>
      <View style={{ marginVertical: 15 }} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 15,
  },
});
