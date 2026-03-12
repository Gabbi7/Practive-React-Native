import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image,
  Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../lib/api";
import { UserInfo } from "../../App";

interface LoginScreenProps {
  onLogin: (user: UserInfo, token: string) => void;
  onSwitchToSignup: () => void;
  onForgotPassword?: () => void;
}

const PRIMARY = "#7370FF";

export default function LoginScreen({ onLogin, onSwitchToSignup, onForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Login Failed", data.error || "Something went wrong.");
        return;
      }
      onLogin(data.user, data.token);
    } catch (err) {
      Alert.alert("Connection Error", "Could not reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputBoxStyle = {
    shadowColor: PRIMARY, shadowOpacity: 0.18, shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }, elevation: 3,
    borderWidth: 1, borderColor: "#E7E7EE",
  } as const;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-white">
        <LinearGradient
          colors={["rgba(115,112,255,0.16)", "rgba(255,255,255,0)"]}
          start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
          className="absolute top-0 left-0 right-0 h-[300px]"
        />
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24, paddingVertical: 40 }}
          enableOnAndroid extraScrollHeight={18} keyboardOpeningTime={220}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[360px] items-center">
            <Image source={require("../../assets/Buildspherelogo4x.png")} style={{ width: 56, height: 56 }} resizeMode="contain" />
            <Text className="mt-5 text-[22px] font-bold text-[#1E1E1E]">Log In to BuildSphere</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-[12.5px] text-[#A3A3A3]">Don't have an account?{" "}</Text>
              <TouchableOpacity onPress={onSwitchToSignup}>
                <Text className="text-[12.5px] font-semibold text-[#7370FF]">Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full mt-10">
              <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Email</Text>
              <View className="bg-white rounded-xl" style={inputBoxStyle}>
                <TextInput value={email} onChangeText={setEmail} placeholder="Enter your email"
                  placeholderTextColor="#B9B9B9" autoCapitalize="none" keyboardType="email-address"
                  className="px-4 h-[52px]" />
              </View>

              <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2 mt-6">Password</Text>
              <View className="bg-white rounded-xl" style={inputBoxStyle}>
                <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password"
                  placeholderTextColor="#B9B9B9" secureTextEntry className="px-4 h-[52px]" />
              </View>

              <TouchableOpacity onPress={handleLogin} disabled={loading}
                className="mt-10 rounded-xl h-[52px] justify-center items-center bg-[#7370FF] shadow-lg">
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold text-[15px]">Log In</Text>}
              </TouchableOpacity>

              {/* OFFLINE BYPASS BTN */}
              <TouchableOpacity 
                onPress={() => {
                  onLogin({
                    id: 999,
                    firstName: "Guest",
                    lastName: "User",
                    email: "guest@guest.com"
                  }, "fake-token");
                }} 
                className="mt-3 rounded-xl h-[52px] justify-center items-center bg-[#F3F3F3]"
              >
                <Text className="text-[#1E1E1E] font-semibold text-[15px]">Demo Mode (Skip Login)</Text>
              </TouchableOpacity> 
              {/* OFFLINE BYPASS BTN */}

              <TouchableOpacity onPress={onForgotPassword} className="self-center mt-6">
                <Text className="text-[12px] text-[#B8B8B8]">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
