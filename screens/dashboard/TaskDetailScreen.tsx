import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Platform, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

interface TaskDetailScreenProps {
    visible: boolean;
    task: any;
    onClose: () => void;
}

interface Comment {
    id: number;
    user: string;
    initials: string;
    text: string;
    avatarBg: string;
    avatarText: string;
}

const PRIMARY = "#7370FF";

export default function TaskDetailScreen({ visible, task, onClose }: TaskDetailScreenProps) {
    if (!task) return null;

    const [activeSection, setActiveSection] = useState<"detail" | "comments">("detail");

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "in-progress": return { bg: "#EAE8FF", text: "#7370FF", label: "In Progress" };
            case "completed": return { bg: "#E8F5E9", text: "#4CAF50", label: "Completed" };
            case "to-review": return { bg: "#FFF4E5", text: "#FF9800", label: "To Review" };
            default: return { bg: "#FAFAFA", text: "#A3A3A3", label: "In Progress" }; // Default to in progress for demo
        }
    };

    const comments: Comment[] = [
        { id: 1, user: "Ivan", initials: "IV", text: "When will the 9th glass be installed?", avatarBg: "#FFD6E8", avatarText: "#FF1F8E" },
        { id: 2, user: "Ivan", initials: "IV", text: "Comments here", avatarBg: "#FFD6E8", avatarText: "#FF1F8E" },
        { id: 3, user: "Ivan", initials: "IV", text: "Another comment here", avatarBg: "#FFD6E8", avatarText: "#FF1F8E" },
    ];

    const statusStyle = getStatusStyle(task.status);
    const priorityColor = task.priority?.toLowerCase() === 'high' ? '#FF6B6B' : '#FFA500';

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row items-center px-5 pt-12 pb-4">
                    <TouchableOpacity onPress={onClose} className="mr-3">
                        <Ionicons name="chevron-back" size={32} color="#1E1E1E" />
                    </TouchableOpacity>
                    <Text className="text-[32px] font-bold text-[#7370FF]">Task Details</Text>
                </View>

                <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {/* Status & Title Card */}
                    <View className="bg-white rounded-[24px] p-6 mb-8 border border-[#F0F0F0]"
                        style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-[20px] font-bold text-[#1E1E1E] flex-1 mr-4">{task.title}</Text>
                            <View className="px-5 py-2 rounded-full" style={{ backgroundColor: statusStyle.bg }}>
                                <Text className="text-[11px] font-bold uppercase tracking-wider" style={{ color: statusStyle.text }}>
                                    {statusStyle.label}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-[14px] text-[#A3A3A3] leading-6">
                            {task.description || "The task involves technical drawings and layouts required for the initial construction phase. Please ensure all details are accurate and adhere to project standards."}
                        </Text>
                    </View>

                    {/* Metadata Grid */}
                    <View className="mb-8">
                        {/* Row 1: Phase, Milestone, Priority */}
                        <View className="flex-row mb-6">
                            <View className="flex-1">
                                <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Phase</Text>
                                <Text className="text-[15px] font-bold text-[#1E1E1E]">{task.phase || "Phase 1"}</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Milestone</Text>
                                <Text className="text-[15px] font-bold text-[#1E1E1E]">{task.milestone || "Milestone 1"}</Text>
                            </View>
                            <View className="flex-1 items-end">
                                <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Priority</Text>
                                <Text className="text-[15px] font-bold" style={{ color: priorityColor }}>
                                    {task.priority || "High"}
                                </Text>
                            </View>
                        </View>

                        {/* Row 2: Dates */}
                        <View className="flex-row">
                            <View className="flex-1">
                                <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Start Date</Text>
                                <Text className="text-[15px] font-bold text-[#1E1E1E]">{task.start_date || "01/31/2026"}</Text>
                            </View>
                            <View className="flex-1 items-end">
                                <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">End Date</Text>
                                <Text className="text-[15px] font-bold text-[#1E1E1E]">{task.due_date || "02/28/2026"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Task Photos Section */}
                    <View className="mb-8">
                        <Text className="text-[18px] font-bold text-[#1E1E1E] mb-4">Task Photos</Text>
                        <TouchableOpacity 
                            className="w-full h-[60px] bg-[#EAE8FF] rounded-[16px] border border-dashed border-[#7370FF] items-center justify-center flex-row mb-4"
                        >
                            <Ionicons name="camera-outline" size={24} color="#7370FF" />
                            <Text className="text-[#7370FF] font-bold ml-3">Add a Task Photo</Text>
                        </TouchableOpacity>
                        
                        {/* Dummy Photo Gird */}
                        <View className="flex-row gap-3">
                            <View className="w-[80px] h-[80px] bg-[#F5F5F7] rounded-[12px] overflow-hidden">
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=300' }} className="w-full h-full" />
                            </View>
                            <View className="w-[80px] h-[80px] bg-[#F5F5F7] rounded-[12px] overflow-hidden">
                                <Image source={{ uri: 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=300' }} className="w-full h-full" />
                            </View>
                        </View>
                    </View>

                    {/* Comments Section */}
                    <View className="bg-[#F6F6FF] rounded-[24px] p-6 mb-10 border border-[#EDECFF]">
                        <Text className="text-[18px] font-bold text-[#1E1E1E] mb-6">Comments</Text>
                        
                        {comments.map((comment, index) => (
                            <View key={comment.id} className={`flex-row items-center ${index !== comments.length - 1 ? 'mb-6' : ''}`}>
                                <View 
                                    className="w-10 h-10 rounded-full items-center justify-center mr-4"
                                    style={{ backgroundColor: comment.avatarBg }}
                                >
                                    <Text className="text-[12px] font-bold" style={{ color: comment.avatarText }}>
                                        {comment.initials}
                                    </Text>
                                </View>
                                <Text className="text-[15px] font-medium text-[#1E1E1E] flex-1">
                                    {comment.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Bottom Navigation Mimic */}
                <View className="h-[90px] border-t border-[#F5F5F7] flex-row items-center justify-between px-10 pb-4">
                    <TouchableOpacity className="items-center">
                        <Ionicons name="home-outline" size={24} color="#9A9A9A" />
                        <Text className="text-[10px] text-[#9A9A9A] mt-1">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <View className="w-12 h-12 bg-[#F0F0F0] rounded-2xl items-center justify-center mb-1">
                            <Ionicons name="briefcase" size={24} color="#7370FF" />
                        </View>
                        <Text className="text-[10px] text-[#7370FF] font-bold">My work</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Ionicons name="notifications-outline" size={24} color="#9A9A9A" />
                        <Text className="text-[10px] text-[#9A9A9A] mt-1">Notifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Ionicons name="ellipsis-horizontal-outline" size={24} color="#9A9A9A" />
                        <Text className="text-[10px] text-[#9A9A9A] mt-1">More</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
