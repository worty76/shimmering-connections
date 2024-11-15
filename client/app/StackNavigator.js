import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import login from "./auth/login";
import register from "./auth/register";
import select from "./auth/select";
import { AuthContext } from "../context/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import {
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import Explore from "./tabs/explore";
import bio from "./tabs/bio/bio";
import profile from "./tabs/profile/profile";
import BottomTabs from "./tabs/index";
import BasicInfo from "./auth/registration/BasicInfo";
import NameScreen from "./auth/registration/NameScreen";
import EmailScreen from "./auth/registration/EmailScreen";
import PasswordScreen from "./auth/registration/PasswordScreen";
import BirthScreen from "./auth/registration/BirthScreen";
import LocationScreen from "./auth/registration/LocationScreen";
import GenderScreen from "./auth/registration/GenderScreen";
import TypeScreen from "./auth/registration/TypeScreen";
import DatingTypeScreen from "./auth/registration/DatingTypeScreen";
import LookingForScreen from "./auth/registration/LookingForScreen";
import HomeTownScreen from "./auth/registration/HomeTownScreen";
import PhotoScreen from "./auth/registration/PhotoScreen";
import PromptScreen from "./auth/registration/PromptScreen";
import ShowPromptScreen from "./auth/registration/ShowPromptScreen";
import PreFinalScreen from "./auth/registration/PreFinalScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const { isLoading, token } = useContext(AuthContext);
  // Ensure token is properly initialized
  console.log("token:", token);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  // Check if token is null or empty
  console.log("Is token null or empty?", token === null || token === "");

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="auth/login"
        component={login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="auth/register"
        component={register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/select"
        component={select}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/BasicInfo"
        component={BasicInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/NameScreen"
        component={NameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/EmailScreen"
        component={EmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/PasswordScreen"
        component={PasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/BirthScreen"
        component={BirthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/LocationScreen"
        component={LocationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/GenderScreen"
        component={GenderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/TypeScreen"
        component={TypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/DatingTypeScreen"
        component={DatingTypeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/LookingForScreen"
        component={LookingForScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/HomeTownScreen"
        component={HomeTownScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="auth/registration/PhotoScreen"
        component={PhotoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/PromptScreen"
        component={PromptScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/registration/ShowPromptScreen"
        component={ShowPromptScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="auth/registration/PreFinalScreen"
        component={PreFinalScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{headerShown: false}}
      /> */}
      {/* Other authentication screens */}
    </Stack.Navigator>
  );

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="tabs/index"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Animation"
          component={AnimationScreen}
          options={{ headerShown: false }}
        /> */}
        {/* 
        <Stack.Screen
          name="Details"
          component={ProfileDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendLike"
          component={SendLikeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HandleLike"
          component={HandleLikeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ChatRoom" component={ChatRoom} /> */}
      </Stack.Navigator>
    );
  }
  //   const MainStack = () => (
  //     <Stack.Navigator>
  //       <Stack.Screen
  //         name="Main"
  //         component={BottomTabs}
  //         options={{headerShown: false}}
  //       />
  //     </Stack.Navigator>
  //   );

  return token === null || token === "" ? <AuthStack /> : <MainStack />;
};

export default StackNavigator;
