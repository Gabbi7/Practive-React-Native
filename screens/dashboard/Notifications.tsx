import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";

interface Notification {
    id: number;
    type: "update" | "alert" | "message" | "success";
    title: string;
    message: string;
    time: string;
    is_read: boolean;
}

interface NotificationsProps {
    userId: number;
}

export default function Notifications({ userId }: NotificationsProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetch(`${API_URL}/notifications?userId=${userId}`)
            .then(res => res.json())
            .then(data => { setNotifications(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [userId]);

    const getIcon = (type: string) => {
        switch (type) {
            case "alert": return "alert-circle";
            case "update": return "calendar";
            case "message": return "chatbox";
            case "success": return "checkmark-circle";
            default: return "notifications";
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case "alert": return "#FF6B6B";
            case "update": return "#7370FF";
            case "message": return "#4DABF7";
            case "success": return "#51CF66";
            default: return "#B9B9B9";
        }
    };

    const markAsRead = async (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        await fetch(`${API_URL}/notifications/${id}/read`, { method: "PATCH" });
    };

    const filtered = filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications;
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["rgba(115,112,255,0.12)", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
                className="absolute top-0 left-0 right-0 h-[200px]"
            />

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 160 }}>
                {/* Header */}
                <View className="pt-5 pb-4">
                    <Text className="text-[24px] font-bold text-[#7370FF]">Notifications</Text>
                    <Text className="text-[13px] text-[#A3A3A3] mt-1">
                        {loading ? "Loading..." : unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </Text>
                </View>

                {/* All / Unread Toggle */}
                <View className="flex-row bg-[#F5F5F7] rounded-[12px] p-1 mb-5">
                    <TouchableOpacity
                        className={`flex-1 py-2 rounded-[10px] items-center ${filter === 'all' ? 'bg-white' : ''}`}
                        onPress={() => setFilter('all')}
                        style={filter === 'all' ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 } : {}}
                    >
                        <Text className={`text-[13px] font-semibold ${filter === 'all' ? 'text-[#1E1E1E]' : 'text-[#A3A3A3]'}`}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-2 rounded-[10px] items-center ${filter === 'unread' ? 'bg-white' : ''}`}
                        onPress={() => setFilter('unread')}
                        style={filter === 'unread' ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 } : {}}
                    >
                        <Text className={`text-[13px] font-semibold ${filter === 'unread' ? 'text-[#1E1E1E]' : 'text-[#A3A3A3]'}`}>
                            Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color="#7370FF" size="large" />
                ) : filtered.length === 0 ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="notifications-off-outline" size={64} color="#E0E0E0" />
                        <Text className="text-[#A3A3A3] text-lg mt-4">
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                        </Text>
                    </View>
                ) : (
                    filtered.map(notif => (
                        <TouchableOpacity
                            key={notif.id}
                            onPress={() => markAsRead(notif.id)}
                            className={`rounded-[16px] p-4 mb-3 ${notif.is_read ? 'bg-white border border-[#F0F0F0]' : 'bg-white border border-[#E8E7FF]'}`}
                            style={{ shadowColor: notif.is_read ? "#000" : "#7370FF", shadowOpacity: notif.is_read ? 0.04 : 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: notif.is_read ? 1 : 3 }}
                        >
                            <View className="flex-row items-start">
                                {/* Icon */}
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5"
                                    style={{ backgroundColor: getColor(notif.type) + "18" }}
                                >
                                    <Ionicons name={getIcon(notif.type) as any} size={20} color={getColor(notif.type)} />
                                </View>

                                {/* Content */}
                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between mb-0.5">
                                        <Text className={`text-[14px] font-semibold ${notif.is_read ? 'text-[#6A6A6A]' : 'text-[#1E1E1E]'}`}>
                                            {notif.title}
                                        </Text>
                                        {!notif.is_read && <View className="w-2 h-2 bg-[#7370FF] rounded-full" />}
                                    </View>

                                    <Text className={`text-[12px] mb-2 leading-5 ${notif.is_read ? 'text-[#A3A3A3]' : 'text-[#5A5A5A]'}`}>
                                        {notif.message}{" "}
                                        <Text className="text-[#7370FF] font-semibold">Check details</Text>
                                    </Text>

                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={11} color="#C0C0C0" />
                                        <Text className="text-[11px] text-[#C0C0C0] ml-1">{notif.time}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
