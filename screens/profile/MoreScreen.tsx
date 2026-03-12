import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UserInfo } from "../../App";
import EditProfileScreen from "./EditProfileScreen";
import EditAccountScreen from "./EditAccountScreen";
import { API_URL } from "../../lib/api";

interface MoreScreenProps {
    user: UserInfo;
    onLogout: () => void;
    onUserUpdated: (updated: UserInfo) => void;
}

export default function MoreScreen({ user, onLogout, onUserUpdated }: MoreScreenProps) {
    const [screen, setScreen] = useState<"more" | "editProfile" | "editAccount">("more");

    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    const photoUri = user.profilePictureUrl ? `${API_URL}${user.profilePictureUrl}` : null;

    if (screen === "editProfile") {
        return (
            <EditProfileScreen
                user={user}
                onBack={() => setScreen("more")}
                onSaved={(updated) => { onUserUpdated(updated); setScreen("more"); }}
            />
        );
    }

    if (screen === "editAccount") {
        return (
            <EditAccountScreen
                user={user}
                onBack={() => setScreen("more")}
                onSaved={(updated) => { onUserUpdated(updated); setScreen("more"); }}
            />
        );
    }

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["rgba(115,112,255,0.12)", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
                className="absolute top-0 left-0 right-0 h-[280px]"
            />

            <ScrollView className="flex-1 px-6 pt-14" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Avatar + Name */}
                <View className="items-center mt-6 mb-10">
                    {/* Avatar */}
                    {photoUri ? (
                        <Image
                            source={{ uri: photoUri }}
                            style={{
                                width: 80, height: 80, borderRadius: 40,
                                shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8,
                            }}
                        />
                    ) : (
                        <View
                            className="w-20 h-20 rounded-full bg-[#F0AEDE] items-center justify-center"
                            style={{ shadowColor: "#F0AEDE", shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}
                        >
                            <Text className="text-[28px] font-bold text-white">{initials}</Text>
                        </View>
                    )}

                    <Text className="text-[20px] font-bold text-[#1E1E1E] mt-4">
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text className="text-[13px] text-[#A3A3A3] mt-1">{user.email}</Text>

                    <TouchableOpacity onPress={() => setScreen("editProfile")} className="mt-2">
                        <Text className="text-[13px] text-[#7370FF] font-semibold">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden"
                    style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>

                    <TouchableOpacity
                        onPress={() => setScreen("editAccount")}
                        className="flex-row items-center justify-between px-5 py-4 border-b border-[#F5F5F5]"
                    >
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-[#EAE8FF] items-center justify-center mr-3">
                                <Ionicons name="person-circle-outline" size={18} color="#7370FF" />
                            </View>
                            <Text className="text-[15px] font-medium text-[#1E1E1E]">Account</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onLogout}
                        className="flex-row items-center px-5 py-4"
                    >
                        <View className="w-8 h-8 rounded-full bg-[#FFE8E8] items-center justify-center mr-3">
                            <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
                        </View>
                        <Text className="text-[15px] font-medium text-[#FF6B6B]">Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
