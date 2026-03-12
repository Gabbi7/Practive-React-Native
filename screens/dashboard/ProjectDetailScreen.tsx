import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";
import InventoryScreen from "./InventoryScreen";

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

function statusBadge(status: string) {
    switch ((status || "").toLowerCase()) {
        case "delayed": return { label: "Delayed", bg: "#FF6B6B", text: "white" };
        case "completed": return { label: "Completed", bg: "#51CF66", text: "white" };
        case "on hold": return { label: "On Hold", bg: "#FFA500", text: "white" };
        default: return { label: "Ongoing", bg: "#7370FF", text: "white" };
    }
}

function fmt(date?: string) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
}

function daysLeft(end?: string) {
    if (!end) return null;
    const diff = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
    return diff;
}

export default function ProjectDetailScreen({ projectId, onBack }: Props) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<"detail" | "inventory" | "siteUpdates" | "tasks">("detail");

    useEffect(() => {
        fetch(`${API_URL}/projects/${projectId}`)
            .then(r => r.json())
            .then(d => { setProject(d); setLoading(false); })
            .catch(() => setLoading(false));
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
    const progress = project.progress || 0;

    return (
        <View className="flex-1 bg-[#F5F5F7]">
            <LinearGradient colors={["rgba(115,112,255,0.1)", "rgba(255,255,255,0)"]}
                className="absolute top-0 left-0 right-0 h-[200px]" />

            {/* Header */}
            <View className="flex-row items-center px-5 pt-14 pb-4">
                <TouchableOpacity onPress={onBack} className="mr-3">
                    <Ionicons name="chevron-back" size={26} color="#7370FF" />
                </TouchableOpacity>
                <Text className="text-[26px] font-bold text-[#7370FF]">Project Name</Text>
            </View>

            <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Project Info Card */}
                <View className="bg-white rounded-[20px] p-5 mb-4 border border-[#F0F0F0]"
                    style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-[17px] font-bold text-[#1E1E1E] flex-1">{project.name}</Text>
                        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: badge.bg }}>
                            <Text className="text-[11px] font-bold" style={{ color: badge.text }}>{badge.label}</Text>
                        </View>
                    </View>

                    {days !== null && (
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="time-outline" size={13} color="#7370FF" />
                            <Text className="text-[12px] text-[#7370FF] ml-1 font-semibold">{days} days left</Text>
                        </View>
                    )}

                    <View className="flex-row flex-wrap">
                        <View className="w-1/2 mb-4">
                            <Text className="text-[11px] text-[#A3A3A3]">Project Engineer</Text>
                            <Text className="text-[13px] font-semibold text-[#1E1E1E]">{project.engineer || "—"}</Text>
                        </View>
                        <View className="w-1/2 mb-4">
                            <Text className="text-[11px] text-[#A3A3A3]">Project Start</Text>
                            <Text className="text-[13px] font-semibold text-[#1E1E1E]">{fmt(project.start_date)}</Text>
                        </View>
                        <View className="w-1/2">
                            <Text className="text-[11px] text-[#A3A3A3]">Budget</Text>
                            <Text className="text-[13px] font-semibold text-[#1E1E1E]">
                                ₱{project.budget ? Number(project.budget).toLocaleString() : "—"}
                            </Text>
                        </View>
                        <View className="w-1/2">
                            <Text className="text-[11px] text-[#A3A3A3]">Project End</Text>
                            <Text className="text-[13px] font-semibold text-[#1E1E1E]">{fmt(project.end_date)}</Text>
                        </View>
                    </View>
                </View>

                {/* Project Progress Card */}
                <View className="bg-white rounded-[20px] p-5 mb-5 border border-[#F0F0F0]"
                    style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-[15px] font-bold text-[#1E1E1E]">Project Progress</Text>
                        <Text className="text-[11px] text-[#A3A3A3]">as of {new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" })}</Text>
                    </View>
                    <View className="flex-row items-center mb-3">
                        <Text className="text-[40px] font-extrabold text-[#4CAF50]">{progress}%</Text>
                        <Ionicons name="trending-up" size={28} color="#FFA500" style={{ marginLeft: 8 }} />
                    </View>
                    <View className="h-[6px] bg-[#F0F0F0] rounded-full overflow-hidden">
                        <View style={{ width: `${progress}%`, backgroundColor: "#4CAF50" }} className="h-full rounded-full" />
                    </View>
                </View>

                {/* Sections */}
                {[
                    { key: "inventory", label: "Inventory" },
                    { key: "siteUpdates", label: "Site Updates" },
                    { key: "tasks", label: "Tasks" },
                ].map(section => (
                    <TouchableOpacity
                        key={section.key}
                        onPress={() => setActiveSection(section.key as any)}
                        className="bg-white rounded-[16px] px-5 py-4 mb-3 flex-row justify-between items-center border border-[#F0F0F0]"
                        style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}
                    >
                        <Text className="text-[15px] font-semibold text-[#1E1E1E]">{section.label}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
