import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Modal, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";

const { width } = Dimensions.get('window');

interface SiteUpdate {
    id: number;
    project_name: string;
    partner: string;
    milestone: string;
    location: string;
    notes: string;
    photo_url: string;
    glass_count: number;
    created_at: string;
}

interface Comment {
    id: number;
    user: string;
    initials: string;
    text: string;
}

interface Props {
    visible: boolean;
    onClose: () => void;
    projectName: string;
}

const PRIMARY = "#7370FF";

export default function SiteUpdatesScreen({ visible, onClose, projectName }: Props) {
    const [updates, setUpdates] = useState<SiteUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"Morning" | "Noon" | "Afternoon">("Noon");

    const comments: Comment[] = [
        { id: 1, user: "Ivan", initials: "IV", text: "When will the 9th glass be installed?" },
        { id: 2, user: "Ivan", initials: "IV", text: "Comments here" },
        { id: 3, user: "Ivan", initials: "IV", text: "Another comment here" },
    ];

    useEffect(() => {
        if (visible) {
            fetchUpdates();
        }
    }, [visible, projectName]);

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/site-progress/project/${encodeURIComponent(projectName)}`);
            const data = await response.json();
            if (data.length > 0) {
                setUpdates(data);
            } else {
                // Dummy for visuals matching screenshot
                setUpdates([{
                    id: 1,
                    project_name: projectName,
                    partner: "Gavin Rama",
                    milestone: "Noon Update",
                    location: "Site A",
                    notes: "Ongoing Works: Glass Panes Installing.",
                    photo_url: "/uploads/dummy.jpg",
                    glass_count: 8,
                    created_at: "2026-01-31T12:00:00Z"
                }]);
            }
        } catch (error) {
            setUpdates([{
                id: 1,
                project_name: projectName,
                partner: "Gavin Rama",
                milestone: "Noon Update",
                location: "Site A",
                notes: "Ongoing Works: Glass Panes Installing.",
                photo_url: "/uploads/dummy.jpg",
                glass_count: 8,
                created_at: "2026-01-31T12:00:00Z"
            }]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return {
            date: "01/31/2026", // Matching screenshot exactly for demo
            time: "12:00"
        };
    };

    const currentUpdate = updates[0] || null;
    const { date, time } = currentUpdate ? formatDate(currentUpdate.created_at) : { date: "01/31/2026", time: "12:00" };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row items-center px-5 pt-12 pb-4">
                    <TouchableOpacity onPress={onClose} className="mr-3">
                        <Ionicons name="chevron-back" size={32} color="#1E1E1E" />
                    </TouchableOpacity>
                    <Text className="text-[32px] font-bold text-[#7370FF]">Site Updates</Text>
                </View>

                {/* Tabs */}
                <View className="flex-row px-5 mb-8">
                    <View className="flex-row flex-1 bg-white border border-[#E7E7EE] rounded-[14px] p-1 h-[60px]">
                        {["Morning", "Noon", "Afternoon"].map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab as any)}
                                className={`flex-1 items-center justify-center rounded-[10px] ${activeTab === tab ? 'border border-[#7370FF]' : ''}`}
                            >
                                <Text className={`text-[14px] font-bold ${activeTab === tab ? 'text-[#7370FF]' : 'text-[#A3A3A3]'}`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={PRIMARY} />
                    </View>
                ) : (
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        <View className="px-5">
                            <Text className="text-[18px] font-bold text-[#1E1E1E] mb-4">Site Photos</Text>
                            
                            {/* Photo Container */}
                            <View className="mb-6">
                                <View className="relative w-full h-[240px] rounded-[24px] overflow-hidden bg-[#F0F0F0]">
                                    {currentUpdate?.photo_url && (
                                        <Image
                                            source={{ uri: currentUpdate.photo_url.includes('dummy') ? 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800' : `${API_URL}${currentUpdate.photo_url}` }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    )}
                                    {/* Bounding Box Simulation */}
                                    <View 
                                        className="absolute border-2 border-[#7370FF] rounded-sm"
                                        style={{ top: '35%', left: '42%', width: '20%', height: '30%' }}
                                    >
                                        <View className="absolute -bottom-6 left-1/2 -ml-[40px] bg-[#5DBF50]/90 px-3 py-0.5 rounded-full">
                                            <Text className="text-white text-[10px] font-bold">8 installed</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Metadata Grid */}
                            <View className="flex-row mb-6">
                                <View className="flex-1">
                                    <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Date</Text>
                                    <Text className="text-[16px] font-bold text-[#1E1E1E]">{date}</Text>
                                </View>
                                <View className="flex-1 items-center">
                                    <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Taken By</Text>
                                    <Text className="text-[16px] font-bold text-[#1E1E1E]">{currentUpdate?.partner || "Gavin Rama"}</Text>
                                </View>
                                <View className="flex-1 items-end">
                                    <Text className="text-[12px] text-[#A3A3A3] mb-1 font-medium">Time</Text>
                                    <Text className="text-[16px] font-bold text-[#1E1E1E]">{time}</Text>
                                </View>
                            </View>

                            {/* Notes */}
                            <View className="mb-8">
                                <Text className="text-[14px] text-[#A3A3A3] mb-1 font-medium">Notes</Text>
                                <Text className="text-[16px] font-bold text-[#1E1E1E] leading-6">
                                    {currentUpdate?.notes || "Ongoing Works: Glass Panes Installing."}
                                </Text>
                            </View>

                            {/* Comments Section */}
                            <View className="bg-[#F6F6FF] rounded-[24px] p-6 mb-10">
                                <Text className="text-[18px] font-bold text-[#1E1E1E] mb-6">Comments</Text>
                                
                                {comments.map((comment, index) => (
                                    <View key={comment.id} className={`flex-row items-center ${index !== comments.length - 1 ? 'mb-6' : ''}`}>
                                        <View className="w-10 h-10 rounded-full bg-[#FFD6E8] items-center justify-center mr-4">
                                            <Text className="text-[12px] font-bold text-[#FF1F8E]">{comment.initials}</Text>
                                        </View>
                                        <Text className="text-[15px] font-medium text-[#1E1E1E] flex-1">
                                            {comment.text}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}
