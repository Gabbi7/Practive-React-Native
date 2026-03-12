import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image,
  Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../lib/api";
import { UserInfo } from "../../App";

interface SignupScreenProps {
  onSignupComplete: (user: UserInfo, token: string) => void;
  onSwitchToLogin: () => void;
}

const PRIMARY = "#7370FF";

export default function SignupScreen({ onSignupComplete, onSwitchToLogin }: SignupScreenProps) {
  const [signUpStep, setSignUpStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleButtonPress = async () => {
    if (signUpStep === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim()) {
        Alert.alert("Missing info", "Please complete First Name, Last Name, and Email.");
        return;
      }
      setSignUpStep(2);
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert("Missing info", "Please enter and confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Signup Failed", data.error || "Something went wrong.");
        return;
      }
      onSignupComplete(data.user, data.token);
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
            <Text className="mt-5 text-[22px] font-bold text-[#1E1E1E]">Sign Up in BuildSphere</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-[12.5px] text-[#A3A3A3]">Already have an account?{" "}</Text>
              <TouchableOpacity onPress={onSwitchToLogin} activeOpacity={0.8}>
                <Text className="text-[12.5px] font-semibold text-[#7370FF]">Log In</Text>
              </TouchableOpacity>
            </View>

            <View className="w-full mt-10">
              {signUpStep === 1 && (
                <>
                  <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">First Name</Text>
                  <View className="bg-white rounded-[12px]" style={inputBoxStyle}>
                    <TextInput value={firstName} onChangeText={setFirstName} placeholder="Enter your first name"
                      placeholderTextColor="#B9B9B9" className="px-4 h-[52px] text-[14px] text-[#1E1E1E]" returnKeyType="next" />
                  </View>
                  <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2 mt-6">Last Name</Text>
                  <View className="bg-white rounded-[12px]" style={inputBoxStyle}>
                    <TextInput value={lastName} onChangeText={setLastName} placeholder="Enter your last name"
                      placeholderTextColor="#B9B9B9" className="px-4 h-[52px] text-[14px] text-[#1E1E1E]" returnKeyType="next" />
                  </View>
                  <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2 mt-6">Email</Text>
                  <View className="bg-white rounded-[12px]" style={inputBoxStyle}>
                    <TextInput value={email} onChangeText={setEmail} placeholder="Enter your email"
                      placeholderTextColor="#B9B9B9" autoCapitalize="none" keyboardType="email-address"
                      className="px-4 h-[52px] text-[14px] text-[#1E1E1E]" returnKeyType="done" />
                  </View>
                </>
              )}

              {signUpStep === 2 && (
                <>
                  <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Password</Text>
                  <View className="bg-white rounded-[12px]" style={inputBoxStyle}>
                    <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password"
                      placeholderTextColor="#B9B9B9" secureTextEntry
                      className="px-4 h-[52px] text-[14px] text-[#1E1E1E]" returnKeyType="next" />
                  </View>
                  <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2 mt-6">Confirm Password</Text>
                  <View className="bg-white rounded-[12px]" style={inputBoxStyle}>
                    <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password"
                      placeholderTextColor="#B9B9B9" secureTextEntry
                      className="px-4 h-[52px] text-[14px] text-[#1E1E1E]" returnKeyType="done" />
                  </View>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setSignUpStep(1)} className="self-center mt-6">
                    <Text className="text-[12px] text-[#B8B8B8]">Back to Step 1</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity activeOpacity={0.9} onPress={handleButtonPress} disabled={loading}
                className="mt-10 rounded-[12px] h-[52px] justify-center items-center bg-[#7370FF]"
                style={{ shadowColor: PRIMARY, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 4 }}>
                {loading ? <ActivityIndicator color="white" /> : (
                  <Text className="text-white font-semibold text-[15px]">
                    {signUpStep === 1 ? "Next" : "Sign Up"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
