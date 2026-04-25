import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import apiClient from "@/app/apiClient";

type User = {
  id: string;
  email: string;
  bio:string;
  address:string;
  phone:string;
  role:boolean;
  user_name?: string;
  profile_URL?:string;
  is_verified:boolean;
  has_paid:boolean;
};

type AuthContextType = {
  user: User | null;
  setUser:React.Dispatch<React.SetStateAction<User | null>>; // fetch user for instan updates
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        setLoading(false);
        return;
      }
      //console.log(token)

      const response = await apiClient.get("/users/me");
      console.log(response.data)
      setUser(response.data);
    } catch (error: any) {
      console.log(error?.response?.data);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};