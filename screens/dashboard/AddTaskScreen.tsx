import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert, ScrollView, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get('window');

interface AddTaskScreenProps {
    visible: boolean;
    onClose: () => void;
    userId: number;
    projects: { id: number; name: string }[];
    onTaskAdded: () => void;
}

const PRIMARY = "#7370FF";

type Step = 1 | 2 | 'success';

export default function AddTaskScreen({ visible, onClose, userId, projects, onTaskAdded }: AddTaskScreenProps) {
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);

    // Form Stats
    const [title, setTitle] = useState("");
    const [selectedProject, setSelectedProject] = useState(projects[0]?.name || "");
    const [phase, setPhase] = useState("");
    const [milestone, setMilestone] = useState("");
    
    // Step 2 Stats
    const [description, setDescription] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [priority, setPriority] = useState("High");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleNext = () => {
        if (!title.trim() || !selectedProject) {
            Alert.alert("Missing Info", "Task Title and Project are required.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!endDate.trim()) {
            Alert.alert("Missing Info", "Task End Date is required.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    project: selectedProject,
                    due_date: endDate,
                    status: "pending",
                    priority: priority.toLowerCase(),
                    user_id: userId,
                    description,
                    assigned_to: assignedTo,
                    phase,
                    milestone,
                    start_date: startDate
                }),
            });

            if (response.ok) {
                setStep('success');
                onTaskAdded();
            } else {
                const data = await response.json();
                Alert.alert("Error", data.error || "Failed to add task.");
            }
        } catch (error) {
            console.error("Error adding task:", error);
            Alert.alert("Connection Error", "Could not reach the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setStep(1);
        setTitle("");
        setPhase("");
        setMilestone("");
        setDescription("");
        setAssignedTo("");
        setPriority("High");
        setStartDate("");
        setEndDate("");
    };

    if (step === 'success') {
        return (
            <Modal visible={visible} animationType="fade" transparent={false}>
                <View className="flex-1 bg-white items-center justify-center px-10">
                    <View className="w-28 h-28 rounded-full bg-[#7370FF] items-center justify-center mb-10 shadow-xl shadow-[#7370FF]/40">
                        <Ionicons name="checkmark" size={60} color="white" />
                    </View>
                    <Text className="text-[26px] font-bold text-[#1E1E1E] text-center">Task Added.</Text>
                    <Text className="text-[15px] text-[#A3A3A3] text-center mt-4 leading-6">
                        Task added. Please Inform the assignee.
                    </Text>
                    <TouchableOpacity 
                        onPress={handleFinish}
                        className="bg-[#7370FF] w-full h-[56px] rounded-[16px] items-center justify-center mt-12 shadow-lg shadow-[#7370FF]/20"
                    >
                        <Text className="text-white font-bold text-[16px]">Back to Task</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View className="flex-1 bg-[#F5F5F7]">
                <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
                    <Text className="text-[18px] font-bold text-[#1E1E1E] flex-1 text-center">Add a Task</Text>
                    <TouchableOpacity onPress={onClose} className="p-1">
                        <Ionicons name="close" size={24} color="#1E1E1E" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                    <View className="bg-white rounded-[24px] p-6 shadow-sm border border-[#F0F0F0] mt-4 mb-10">
                        {step === 1 ? (
                            <>
                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Task Title</Text>
                                <TextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Submit shop drawings for approval"
                                    className="bg-[#F9F9F9] h-[52px] px-4 rounded-xl border border-[#F0F0F0] mb-5"
                                />

                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Project</Text>
                                <View className="bg-[#F9F9F9] rounded-xl border border-[#F0F0F0] mb-5 overflow-hidden">
                                    <Picker
                                        selectedValue={selectedProject}
                                        onValueChange={(v) => setSelectedProject(v)}
                                        style={{ height: 52 }}
                                    >
                                        {projects.map((p) => <Picker.Item key={p.id} label={p.name} value={p.name} />)}
                                    </Picker>
                                </View>

                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Phase</Text>
                                <View className="bg-[#F9F9F9] rounded-xl border border-[#F0F0F0] mb-5 overflow-hidden">
                                    <Picker
                                        selectedValue={phase}
                                        onValueChange={(v) => setPhase(v)}
                                        style={{ height: 52 }}
                                    >
                                        <Picker.Item label="Premilinary" value="Premilinary" />
                                        <Picker.Item label="Construction" value="Construction" />
                                        <Picker.Item label="Finishing" value="Finishing" />
                                    </Picker>
                                </View>

                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Milestone</Text>
                                <View className="bg-[#F9F9F9] rounded-xl border border-[#F0F0F0] mb-10 overflow-hidden">
                                    <Picker
                                        selectedValue={milestone}
                                        onValueChange={(v) => setMilestone(v)}
                                        style={{ height: 52 }}
                                    >
                                        <Picker.Item label="Shop Drawings" value="Shop Drawings" />
                                        <Picker.Item label="Foundation" value="Foundation" />
                                        <Picker.Item label="Glass Installation" value="Glass Installation" />
                                    </Picker>
                                </View>

                                <TouchableOpacity onPress={handleNext} className="bg-[#7370FF] h-[52px] rounded-xl items-center justify-center">
                                    <Text className="text-white font-bold text-[15px]">Next</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Task Description</Text>
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Submit the complete shop drawings..."
                                    multiline
                                    className="bg-[#F9F9F9] h-[80px] px-4 py-3 rounded-xl border border-[#F0F0F0] mb-5"
                                />

                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Assigned to</Text>
                                <View className="bg-[#F9F9F9] rounded-xl border border-[#F0F0F0] mb-5 overflow-hidden">
                                    <Picker
                                        selectedValue={assignedTo}
                                        onValueChange={(v) => setAssignedTo(v)}
                                        style={{ height: 52 }}
                                    >
                                        <Picker.Item label="Michael Replan" value="Michael Replan" />
                                        <Picker.Item label="Gavin Rama" value="Gavin Rama" />
                                        <Picker.Item label="John Doe" value="John Doe" />
                                    </Picker>
                                </View>

                                <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Priority Level</Text>
                                <View className="bg-[#F9F9F9] rounded-xl border border-[#F0F0F0] mb-5 overflow-hidden">
                                    <Picker
                                        selectedValue={priority}
                                        onValueChange={(v) => setPriority(v)}
                                        style={{ height: 52 }}
                                    >
                                        <Picker.Item label="High" value="High" />
                                        <Picker.Item label="Medium" value="Medium" />
                                        <Picker.Item label="Low" value="Low" />
                                    </Picker>
                                </View>

                                <View className="flex-row justify-between mb-10">
                                    <View style={{ width: '48%' }}>
                                        <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Task Start</Text>
                                        <View className="bg-[#F9F9F9] h-[52px] px-4 rounded-xl border border-[#F0F0F0] flex-row items-center justify-between">
                                            <TextInput
                                                value={startDate}
                                                onChangeText={setStartDate}
                                                placeholder="02/11/2026"
                                                className="flex-1 text-[13px]"
                                            />
                                            <Ionicons name="calendar-outline" size={18} color="#A3A3A3" />
                                        </View>
                                    </View>
                                    <View style={{ width: '48%' }}>
                                        <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-2">Task End</Text>
                                        <View className="bg-[#F9F9F9] h-[52px] px-4 rounded-xl border border-[#F0F0F0] flex-row items-center justify-between">
                                            <TextInput
                                                value={endDate}
                                                onChangeText={setEndDate}
                                                placeholder="02/18/2026"
                                                className="flex-1 text-[13px]"
                                            />
                                            <Ionicons name="calendar-outline" size={18} color="#A3A3A3" />
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    onPress={handleSubmit} 
                                    disabled={loading}
                                    className="bg-[#7370FF] h-[52px] rounded-xl items-center justify-center"
                                >
                                    {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-[15px]">Submit</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setStep(1)} className="mt-4 items-center">
                                    <Text className="text-[#A3A3A3] text-[14px]">Back to Step 1</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
