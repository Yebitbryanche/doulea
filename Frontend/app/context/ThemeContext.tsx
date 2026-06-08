import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  theme: string;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
  loading: boolean;
};

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext =
  createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const [theme, setTheme] =
    useState("dark");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme =
      await AsyncStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
    }

    setLoading(false);
  };

  const toggleTheme = async () => {
    const newTheme =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);

    await AsyncStorage.setItem(
      "theme",
      newTheme
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        toggleTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};