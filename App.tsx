import "./global.css";
import { useState, useEffect } from "react";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";

export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
}

export default function App() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // Restore session from storage
  useEffect(() => {
    AsyncStorage.getItem("user").then((stored) => {
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    });
  }, []);

  const handleLogin = async (loggedInUser: UserInfo, token: string) => {
    await AsyncStorage.setItem("user", JSON.stringify(loggedInUser));
    await AsyncStorage.setItem("token", token);
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#7370FF" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <DashboardScreen user={user} onLogout={handleLogout} />
      </SafeAreaProvider>
    );
  }
  
  if (showSignup) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <SignupScreen
          onSignupComplete={(u, t) => { handleLogin(u, t); setShowSignup(false); }}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    </SafeAreaProvider>
  );
}