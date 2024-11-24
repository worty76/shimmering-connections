import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./auth/LoginScreen";
import { AuthContext } from "../context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Explore from "./tabs/Explore";
import bio from "./tabs/bio/BioScreen";
import profile from "./tabs/profile/LikesScreen";
import BottomTabs from "./tabs/index";
import BasicInfo from "./auth/registration/BasicInfo";
import NameScreen from "./auth/registration/NameScreen";
import EmailScreen from "./auth/registration/EmailScreen";
import PasswordScreen from "./auth/registration/PasswordScreen";
import BirthScreen from "./auth/registration/BirthScreen";
import GenderScreen from "./auth/registration/GenderScreen";
import TypeScreen from "./auth/registration/TypeScreen";
import DatingTypeScreen from "./auth/registration/DatingTypeScreen";
import LookingForScreen from "./auth/registration/LookingForScreen";
import HomeTownScreen from "./auth/registration/HomeTownScreen";
import PhotoScreen from "./auth/registration/PhotoScreen";
import PromptScreen from "./auth/registration/PromptScreen";
import ShowPromptScreen from "./auth/registration/ShowPromptScreen";
import PreFinalScreen from "./auth/registration/PreFinalScreen";
import ProfileDetailsScreen from "./tabs/profile/ProfileDetailsScreen";
import EditInfoScreen from "./tabs/profile/EditInfoScreen";
import HandleLikeScreen from "./tabs/profile/HandleLikeScreen";
import EditPhotosScreen from "./tabs/profile/EditPhotoScreen";
import ChatRoom from "./tabs/chat/ChatRoom";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const { isLoading, token } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BasicInfo"
        component={BasicInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NameScreen"
        component={NameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailScreen"
        component={EmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PasswordScreen"
        component={PasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BirthScreen"
        component={BirthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GenderScreen"
        component={GenderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TypeScreen"
        component={TypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DatingTypeScreen"
        component={DatingTypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LookingForScreen"
        component={LookingForScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeTownScreen"
        component={HomeTownScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PhotoScreen"
        component={PhotoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PromptScreen"
        component={PromptScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowPromptScreen"
        component={ShowPromptScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PreFinalScreen"
        component={PreFinalScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="index"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProfileDetailsScreen"
          component={ProfileDetailsScreen}
          options={{ headerShown: false, title: "User's details information" }}
        />
        <Stack.Screen
          name="EditInfoScreen"
          component={EditInfoScreen}
          options={{ headerShown: false, title: "Edit your information" }}
        />
        <Stack.Screen
          name="HandleLikeScreen"
          component={HandleLikeScreen}
          options={{ headerShown: false, title: "People liked you" }}
        />
        <Stack.Screen
          name="EditPhotosScreen"
          component={EditPhotosScreen}
          options={{ headerShown: true, title: "Edit Photos" }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{ headerShown: false, title: "Chat Room" }}
        />
      </Stack.Navigator>
    );
  }
  return token === null || token === "" ? <AuthStack /> : <MainStack />;
};

export default StackNavigator;
