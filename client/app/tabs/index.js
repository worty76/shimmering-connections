import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "./Explore";
import BioScreen from "./bio/BioScreen";
import ProfileScreen from "./profile/LikesScreen";
import ChatScreen from "./chat/ChatScreen";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

export default function BottomTabs() {
  const Tab = createBottomTabNavigator();
  const { isLoading, token } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#101010", borderTopWidth: 0 },
        headerShown: false,
      }}
    >
      {/* Explore Tab - Showing Users to Like */}
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="heart-circle-outline"
              size={focused ? 35 : 30}
              color={focused ? "white" : "#989898"}
            />
          ),
        }}
      />

      {/* Bio Tab - User Profile */}
      <Tab.Screen
        name="Bio"
        component={BioScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={focused ? 35 : 30}
              color={focused ? "white" : "#989898"}
            />
          ),
        }}
      />

      {/* Profile Tab - People Who Liked Me */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="heart-multiple-outline"
              size={focused ? 35 : 30}
              color={focused ? "white" : "#989898"}
            />
          ),
        }}
      />

      {/* Chat Tab - Messaging */}
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="message-circle"
              size={focused ? 35 : 30}
              color={focused ? "white" : "#989898"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
