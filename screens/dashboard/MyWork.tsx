import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";

interface Task {
    id: number;
    title: string;
    project: string;
    due_date: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
}

interface MyWorkProps {
    userId: number;
}

export default function MyWork({ userId }: MyWorkProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/tasks?userId=${userId}`)
            .then(res => res.json())
            .then(data => { setTasks(data); setLoading(false); })
            .catch(() => {
                // If offline, show dummy tasks
                setTasks([
                    { id: 1, title: "Review Foundation Plans", project: "High Rise Building", due_date: "Oct 25", status: "in-progress", priority: "high" },
                    { id: 2, title: "Order Concrete Mix", project: "DMCI Homes", due_date: "Oct 26", status: "pending", priority: "medium" },
                    { id: 3, title: "Safety Inspection", project: "Sunset Apartments", due_date: "Oct 28", status: "pending", priority: "high" }
                ]);
                setLoading(false);
            });
    }, [userId]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "#FF6B6B";
            case "medium": return "#FFA94D";
            case "low": return "#4DABF7";
            default: return "#B9B9B9";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return "checkmark-circle";
            case "in-progress": return "time";
            case "pending": return "ellipse-outline";
            default: return "ellipse-outline";
        }
    };

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["rgba(115,112,255,0.16)", "rgba(255,255,255,0)"]}
                start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
                className="absolute top-0 left-0 right-0 h-[200px]"
            />
            <ScrollView className="flex-1 px-6 pt-12">
                <View className="mb-8">
                    <Text className="text-[28px] font-bold text-[#1E1E1E]">My Work</Text>
                    <Text className="text-[14px] text-[#A3A3A3] mt-1">
                        {loading ? "Loading..." : `${tasks.length} tasks assigned to you`}
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator color="#7370FF" size="large" />
                ) : tasks.length === 0 ? (
                    <View className="flex-1 items-center justify-center mt-20">
                        <Ionicons name="briefcase-outline" size={64} color="#E0E0E0" />
                        <Text className="text-[#A3A3A3] text-lg mt-4">No tasks yet</Text>
                        <Text className="text-[#C3C3C3] text-sm mt-2">Tasks assigned to you will appear here</Text>
                    </View>
                ) : (
                    <>
                        {/* Stats */}
                        <View className="flex-row gap-3 mb-6">
                            <View className="flex-1 bg-[#F9F9F9] rounded-xl p-4 border border-[#E7E7EE]">
                                <Text className="text-[12px] text-[#A3A3A3]">In Progress</Text>
                                <Text className="text-[24px] font-bold text-[#7370FF] mt-1">
                                    {tasks.filter(t => t.status === "in-progress").length}
                                </Text>
                            </View>
                            <View className="flex-1 bg-[#F9F9F9] rounded-xl p-4 border border-[#E7E7EE]">
                                <Text className="text-[12px] text-[#A3A3A3]">Pending</Text>
                                <Text className="text-[24px] font-bold text-[#FFA94D] mt-1">
                                    {tasks.filter(t => t.status === "pending").length}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-[16px] font-semibold text-[#1E1E1E] mb-4">Your Tasks</Text>
                        {tasks.map(task => (
                            <TouchableOpacity key={task.id} className="bg-white rounded-xl p-4 mb-3 border border-[#E7E7EE]"
                                style={{ shadowColor: "#7370FF", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
                                <View className="flex-row items-start justify-between">
                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-2">
                                            <Ionicons name={getStatusIcon(task.status) as any} size={18}
                                                color={task.status === "completed" ? "#51CF66" : "#7370FF"} />
                                            <Text className="text-[15px] font-semibold text-[#1E1E1E] ml-2">{task.title}</Text>
                                        </View>
                                        <Text className="text-[13px] text-[#A3A3A3] mb-2">📁 {task.project}</Text>
                                        <View className="flex-row items-center">
                                            <View className="px-3 py-1 rounded-full mr-2" style={{ backgroundColor: getPriorityColor(task.priority) + "20" }}>
                                                <Text className="text-[11px] font-semibold" style={{ color: getPriorityColor(task.priority) }}>
                                                    {task.priority.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Ionicons name="calendar-outline" size={12} color="#A3A3A3" />
                                            <Text className="text-[12px] text-[#A3A3A3] ml-1">{task.due_date}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#B9B9B9" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
