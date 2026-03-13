import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";
import InventoryScreen from "./InventoryScreen";
import SiteUpdatesScreen from "./SiteUpdatesScreen";

const { width } = Dimensions.get('window');

interface Project {
    id: number;
    name: string;
    location: string;
    color: string;
    status: string;
    engineer?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    progress?: number;
}

interface Props {
    projectId: number;
    onBack: () => void;
}

const PRIMARY = "#7370FF";

function statusBadge(status: string) {
    switch ((status || "").toLowerCase()) {
        case "delayed": return { label: "Delayed", bg: "#FF6B6B", text: "white" };
        case "completed": return { label: "Completed", bg: "#51CF66", text: "white" };
        case "on hold": return { label: "On Hold", bg: "#FFA500", text: "white" };
        default: return { label: "Ongoing", bg: "#7370FF", text: "white" };
    }
}

function fmt(date?: string) {
    if (!date) return "01/01/2026"; // Fallback to match screenshot style
    try {
        return new Date(date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    } catch {
        return "01/01/2026";
    }
}

function daysLeft(end?: string) {
    if (!end) return 128; // Dummy for UI demo matching screenshot
    const diff = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
}

export default function ProjectDetailScreen({ projectId, onBack }: Props) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<"detail" | "inventory" | "siteUpdates" | "tasks">("detail");
    const [showSiteUpdates, setShowSiteUpdates] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/projects/${projectId}`)
            .then(r => r.json())
            .then(d => { setProject(d); setLoading(false); })
            .catch(() => {
                // If offline or error, show dummy for visuals matching screenshot
                setProject({
                    id: projectId,
                    name: "ABC Glasswork Project",
                    location: "Manila",
                    color: "#7370FF",
                    status: "Delayed",
                    engineer: "Michael Replan",
                    start_date: "2026-01-01",
                    end_date: "2026-06-29",
                    budget: 83000,
                    progress: 65
                });
                setLoading(false);
            });
    }, [projectId]);

    if (activeSection === "inventory" && project) {
        return <InventoryScreen projectId={project.id} onBack={() => setActiveSection("detail")} />;
    }

    if (loading || !project) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#7370FF" size="large" />
            </View>
        );
    }

    const badge = statusBadge(project.status);
    const days = daysLeft(project.end_date);
    const progress = project.progress || 65;

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-5 pt-12 pb-4">
                <TouchableOpacity onPress={onBack} className="mr-3">
                    <Ionicons name="chevron-back" size={32} color="#1E1E1E" />
                </TouchableOpacity>
                <Text className="text-[32px] font-bold text-[#7370FF]">Project Name</Text>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Main Info Card */}
                <View className="bg-white rounded-[24px] p-6 mb-5 border border-[#F0F0F0]"
                    style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 15, elevation: 3 }}>
                    
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-[20px] font-bold text-[#1E1E1E] flex-1">{project.name}</Text>
                        <View className="px-5 py-2 rounded-full" style={{ backgroundColor: "#FF7D7D" }}>
                            <Text className="text-[11px] font-bold text-white uppercase tracking-wider">{project.status}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-6">
                        <View className="bg-[#EAE8FF] px-3 py-1.5 rounded-lg flex-row items-center border border-[#DEDCFF]">
                            <Ionicons name="time-outline" size={14} color="#7370FF" />
                            <Text className="text-[12px] text-[#7370FF] ml-1.5 font-bold">{days} days left</Text>
                        </View>
                    </View>

                    <View className="flex-row mb-6">
                        <View className="flex-1">
                            <Text className="text-[11px] text-[#A3A3A3] mb-1 font-medium">Project Engineer</Text>
                            <Text className="text-[13px] font-bold text-[#1E1E1E]">{project.engineer || "Michael Replan"}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[11px] text-[#A3A3A3] mb-1 font-medium">Project Start</Text>
                            <Text className="text-[13px] font-bold text-[#1E1E1E]">{fmt(project.start_date)}</Text>
                        </View>
                    </View>

                    <View className="flex-row">
                        <View className="flex-1">
                            <Text className="text-[11px] text-[#A3A3A3] mb-1 font-medium">Budget</Text>
                            <Text className="text-[13px] font-bold text-[#1E1E1E]">₱{project.budget?.toLocaleString()}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[11px] text-[#A3A3A3] mb-1 font-medium">Project End</Text>
                            <Text className="text-[13px] font-bold text-[#1E1E1E]">{fmt(project.end_date)}</Text>
                        </View>
                    </View>
                </View>

                {/* Progress Card */}
                <View className="bg-white rounded-[24px] p-6 mb-4 border border-[#F0F0F0]"
                    style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 15, elevation: 3 }}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-[18px] font-bold text-[#1E1E1E]">Project Progress</Text>
                        <Text className="text-[11px] text-[#A3A3A3]">as of 01/31/26</Text>
                    </View>
                    
                    <View className="flex-row items-center mb-6">
                        <Text className="text-[48px] font-extrabold text-[#5DBF50]">{progress}%</Text>
                        {/* Custom Sparkline Placeholder */}
                        <View className="ml-4 flex-row items-end h-[30px]">
                            <Ionicons name="trending-up" size={32} color="#FF9F1C" />
                            <View className="h-[2px] w-[50px] bg-[#FF9F1C] -ml-2 mb-[14px]" style={{ transform: [{ rotate: '-15deg' }] }} />
                        </View>
                    </View>

                    <View className="h-[2px] bg-[#E0E0E0] w-full rounded-full">
                        <View style={{ width: `${progress}%`, backgroundColor: "#5DBF50" }} className="h-full rounded-full" />
                    </View>
                </View>

                {/* Navigation List */}
                <View className="mt-8">
                    {[
                        { label: "Inventory", key: "inventory" },
                        { label: "Site Updates", key: "siteUpdates" },
                        { label: "Tasks", key: "tasks" }
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => {
                                if (item.key === "siteUpdates") setShowSiteUpdates(true);
                                else if (item.key === "inventory") setActiveSection("inventory");
                                else if (item.key === "tasks") {
                                    // Could navigate to tasks list filtered by project
                                }
                            }}
                            className="bg-white rounded-[20px] px-6 py-5 mb-4 flex-row justify-between items-center border border-[#F5F5F7]"
                            style={{ shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 }}
                        >
                            <Text className="text-[16px] font-bold text-[#1E1E1E]">{item.label}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#D1D1D6" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Nav Simulation */}
            <View className="h-[90px] border-t border-[#F5F5F7] flex-row items-center justify-between px-10 pb-4">
                <TouchableOpacity className="items-center">
                    <View className="w-12 h-12 bg-[#F0F0F0] rounded-2xl items-center justify-center mb-1">
                        <Ionicons name="home" size={24} color="#7370FF" />
                    </View>
                    <Text className="text-[10px] text-[#7370FF] font-bold">Home</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                    <Ionicons name="briefcase-outline" size={24} color="#9A9A9A" />
                    <Text className="text-[10px] text-[#9A9A9A] mt-1">My work</Text>
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

            {project && (
                <SiteUpdatesScreen
                    visible={showSiteUpdates}
                    projectName={project.name}
                    onClose={() => setShowSiteUpdates(false)}
                />
            )}
        </View>
    );
}
