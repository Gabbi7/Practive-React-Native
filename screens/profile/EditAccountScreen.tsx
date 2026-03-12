import React, { useState } from "react";
import {
    View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";
import { UserInfo } from "../../App";

interface EditAccountScreenProps {
    user: UserInfo;
    onBack: () => void;
    onSaved: (updated: UserInfo) => void;
}

const PRIMARY = "#7370FF";

export default function EditAccountScreen({ user, onBack, onSaved }: EditAccountScreenProps) {
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!email.trim()) { Alert.alert("Missing info", "Email is required."); return; }
        if (password && password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const body: any = { email };
            if (password) body.password = password;

            const res = await fetch(`${API_URL}/users/${user.id}/account`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) { Alert.alert("Error", data.error); return; }
            onSaved({ ...user, email });
            Alert.alert("Saved!", "Your account has been updated.");
            onBack();
        } catch {
            Alert.alert("Error", "Could not reach the server.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        borderWidth: 1, borderColor: "#E7E7EE", borderRadius: 12,
        paddingHorizontal: 14, height: 52, backgroundColor: "white",
        fontSize: 15, color: "#1E1E1E", marginBottom: 12,
    } as const;

    const focusedStyle = {
        ...inputStyle, borderColor: PRIMARY,
    } as const;

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["rgba(115,112,255,0.12)", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
                className="absolute top-0 left-0 right-0 h-[250px]"
            />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
                <TouchableOpacity onPress={onBack}>
                    <Ionicons name="chevron-back" size={26} color="#1E1E1E" />
                </TouchableOpacity>
                <Text className="text-[17px] font-bold text-[#1E1E1E]">Edit Account</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color={PRIMARY} /> : (
                        <Text className="text-[15px] font-semibold text-[#7370FF]">Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 mt-4" contentContainerStyle={{ paddingBottom: 40 }}>
                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Email</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={focusedStyle}
                    placeholder="Email address"
                    placeholderTextColor="#B9B9B9"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2 mt-3">
                    New Password <Text className="text-[#B9B9B9] font-normal">(leave blank to keep current)</Text>
                </Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={inputStyle}
                    placeholder="Password"
                    placeholderTextColor="#B9B9B9"
                    secureTextEntry
                />

                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2 mt-3">Confirm Password</Text>
                <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={inputStyle}
                    placeholder="Confirm Password"
                    placeholderTextColor="#B9B9B9"
                    secureTextEntry
                />
            </ScrollView>
        </View>
    );
}
