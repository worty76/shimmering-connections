import { Stack } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Explore from "./explore";
import bio from "./bio/bio";
import profile from "./profile/profile";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";

export default function BottomTabs() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const { isLoading, token } = useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="explore"
        component={Explore}
        options={{
          tabBarStyle: { backgroundColor: "#101010" },
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons name="alpha" size={35} color="white" />
            ) : (
              <MaterialCommunityIcons name="alpha" size={35} color="#989898" />
            ),
        }}
      />

      <Tab.Screen
        name="bio"
        component={bio}
        options={{
          tabBarStyle: { backgroundColor: "#101010" },
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="heart" size={30} color="white" />
            ) : (
              <Entypo name="heart" size={30} color="#989898" />
            ),
        }}
      />

      <Tab.Screen
        name="profile"
        component={profile}
        options={{
          tabBarStyle: { backgroundColor: "#101010" },
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialIcons
                name="chat-bubble-outline"
                size={30}
                color="white"
              />
            ) : (
              <MaterialIcons
                name="chat-bubble-outline"
                size={30}
                color="#989898"
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
