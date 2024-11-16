import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    setToken("token");
    setIsLoading(false);
  };

  const register = () => {
    setToken("");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const userToken = await AsyncStorage.getItem("token");
      setToken(userToken);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    isLoggedIn();
  }, [token]);
  useEffect(() => {
    if (token) {
      console.log("Token set, performing navigation...");
    }
  }, [token]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
  };
  return (
    <AuthContext.Provider
      value={{ token, isLoading, login, register, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
