import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";

interface Task {
    id: number;
    title: string;
    project: string;
    due_date: string;
    status: string;
    priority: string;
    description?: string;
    assigned_to?: string;
    phase?: string;
    milestone?: string;
    start_date?: string;
}

interface MyWorkProps {
    userId: number;
    onTaskSelect: (task: Task) => void;
}

type Tab = "To Do" | "In Progress" | "To Review" | "Completed";

const STATUS_MAP: Record<Tab, string> = {
    "To Do": "pending",
    "In Progress": "in-progress",
    "To Review": "to-review",
    "Completed": "completed"
};

export default function MyWork({ userId, onTaskSelect }: MyWorkProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("In Progress");

    useEffect(() => {
        fetch(`${API_URL}/tasks?userId=${userId}`)
            .then(res => res.json())
            .then(data => { 
                setTasks(data); 
                setLoading(false); 
            })
            .catch(() => {
                // Dummy Data matching screenshot feel
                setTasks([
                    { id: 1, title: "Submit shop drawings for approval", project: "Arane Corp", phase: "Preliminary", milestone: "Shop Drawings", status: "in-progress", priority: "high", due_date: "02/18/2026", start_date: "02/11/2026" },
                    { id: 2, title: "Order Concrete Mix", project: "DMCI Homes", status: "pending", priority: "medium", due_date: "02/20/2026" },
                    { id: 3, title: "Site Inspection", project: "Sunset Apartments", status: "to-review", priority: "high", due_date: "02/21/2026" },
                    { id: 4, title: "Foundation Pouring", project: "City Tower A", status: "completed", priority: "high", due_date: "02/10/2026" },
                ]);
                setLoading(false);
            });
    }, [userId]);

    const getTabCount = (tab: Tab) => {
        return tasks.filter(t => t.status === STATUS_MAP[tab]).length;
    };

    const filteredTasks = tasks.filter(t => t.status === STATUS_MAP[activeTab]);

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case "high": return "#7370FF";
            case "medium": return "#FFA94D";
            case "low": return "#4DABF7";
            default: return "#7370FF";
        }
    };

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={["rgba(115,112,255,0.08)", "rgba(255,255,255,0)"]}
                className="absolute top-0 left-0 right-0 h-[250px]"
            />
            
            <View className="px-5 pt-8">
                <Text className="text-[24px] font-bold text-[#1E1E1E]">My work</Text>
                
                {/* Tabs */}
                <View className="flex-row justify-between mt-6 bg-[#F5F5F7] p-1 rounded-2xl h-[90px]">
                    {(["To Do", "In Progress", "To Review", "Completed"] as Tab[]).map((tab) => {
                        const isActive = activeTab === tab;
                        const count = getTabCount(tab);
                        return (
                            <TouchableOpacity 
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 items-center justify-center rounded-xl ${isActive ? 'bg-white shadow-sm border border-[#E7E7EE]' : ''}`}
                            >
                                <Text className={`text-[20px] font-bold ${isActive ? 'text-[#7370FF]' : 'text-[#A3A3A3]'}`}>
                                    {count < 10 ? `0${count}` : count}
                                </Text>
                                <Text className={`text-[10px] mt-1 font-medium ${isActive ? 'text-[#1E1E1E]' : 'text-[#A3A3A3]'}`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Filters */}
                <View className="flex-row mt-4 px-1">
                    <TouchableOpacity className="flex-row items-center bg-white border border-[#E7E7EE] px-3 py-1.5 rounded-lg mr-3">
                        <Ionicons name="swap-vertical" size={14} color="#1E1E1E" />
                        <Text className="text-[12px] text-[#1E1E1E] ml-1.5">Sort by</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center bg-white border border-[#E7E7EE] px-3 py-1.5 rounded-lg">
                        <Ionicons name="filter" size={14} color="#1E1E1E" />
                        <Text className="text-[12px] text-[#1E1E1E] ml-1.5">Filter</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 mt-4 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {loading ? (
                    <ActivityIndicator color="#7370FF" style={{ marginTop: 40 }} />
                ) : filteredTasks.length === 0 ? (
                    <View className="items-center justify-center mt-20">
                        <Ionicons name="document-text-outline" size={48} color="#E0E0E0" />
                        <Text className="text-[#A3A3A3] text-[14px] mt-4">No tasks in this category</Text>
                    </View>
                ) : (
                    filteredTasks.map((task) => (
                        <TouchableOpacity 
                            key={task.id} 
                            onPress={() => onTaskSelect(task)}
                            className="bg-white rounded-xl mb-3 overflow-hidden border border-[#F0F0F0]"
                            style={{ 
                                shadowColor: "#000", 
                                shadowOpacity: 0.04, 
                                shadowRadius: 8, 
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 2
                            }}
                        >
                            <View className="flex-row">
                                <View className="w-1.5 h-full" style={{ backgroundColor: getPriorityColor(task.priority) }} />
                                <View className="flex-1 p-4 flex-row items-center justify-between">
                                    <View className="flex-1 mr-3">
                                        <Text className="text-[15px] font-semibold text-[#1E1E1E]" numberOfLines={1}>
                                            {task.title}
                                        </Text>
                                        <View className="flex-row items-center mt-1.5">
                                            <Text className="text-[12px] text-[#A3A3A3]">{task.project}</Text>
                                            {task.phase && (
                                                <>
                                                    <View className="w-1 h-1 rounded-full bg-[#D9D9D9] mx-2" />
                                                    <Text className="text-[12px] text-[#A3A3A3]">{task.phase}</Text>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Ionicons name="ellipsis-horizontal" size={18} color="#B9B9B9" />
                                        <View className="mt-2 bg-[#F9F9F9] px-2 py-0.5 rounded-md">
                                            <Text className="text-[10px] text-[#A3A3A3] font-medium">{task.due_date}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
