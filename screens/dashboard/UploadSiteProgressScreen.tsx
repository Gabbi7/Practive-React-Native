import React, { useState } from "react";
import {
    View, Text, TouchableOpacity, ScrollView, TextInput,
    Alert, ActivityIndicator, Image, Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../lib/api";
import { UserInfo } from "../../App";

interface Props {
    visible: boolean;
    user: UserInfo;
    onClose: () => void;
    projects: { id: number; name: string }[];
}

const PRIMARY = "#7370FF";

// Step 1: Pick photo + basic info
// Step 2: Full photo preview
// Step 3: Form details
// Step 4: Success

export default function UploadSiteProgressScreen({ visible, user, onClose, projects }: Props) {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("");
    const [partner, setPartner] = useState("");
    const [milestone, setMilestone] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const reset = () => {
        setStep(1);
        setPhotoUri(null);
        setProjectName("");
        setPartner("");
        setMilestone("");
        setLocation("");
        setNotes("");
        setSaving(false);
    };

    const handleClose = () => { reset(); onClose(); };

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") { Alert.alert("Permission required", "Please allow photo library access."); return; }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") { Alert.alert("Permission required", "Please allow camera access."); return; }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false, quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    };

    const showPhotoOptions = () => {
        Alert.alert("Add Photo", "Choose an option", [
            { text: "Take Photo", onPress: takePhoto },
            { text: "Choose from Library", onPress: pickFromLibrary },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const handleSave = async () => {
        if (!projectName.trim()) { Alert.alert("Missing info", "Please enter a project name."); return; }
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("projectName", projectName);
            formData.append("partner", partner);
            formData.append("milestone", milestone);
            formData.append("location", location);
            formData.append("notes", notes);
            formData.append("userId", String(user.id));

            if (photoUri) {
                const filename = photoUri.split("/").pop() || "photo.jpg";
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : "image/jpeg";
                formData.append("photo", { uri: photoUri, name: filename, type } as any);
            }

            const res = await fetch(`${API_URL}/site-progress`, { method: "POST", body: formData });
            if (!res.ok) { const d = await res.json(); Alert.alert("Error", d.error); return; }
            setStep(4);
        } catch {
            Alert.alert("Error", "Could not reach the server.");
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        borderWidth: 1, borderColor: "#E7E7EE", borderRadius: 12,
        paddingHorizontal: 14, height: 50, backgroundColor: "#FAFAFA",
        fontSize: 14, color: "#1E1E1E", marginBottom: 12,
    } as const;

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
            <View className="flex-1 bg-white">
                {/* ── STEP 1: Upload photo + quick info ── */}
                {step === 1 && (
                    <>
                        <LinearGradient colors={["rgba(115,112,255,0.1)", "rgba(255,255,255,0)"]}
                            className="absolute top-0 left-0 right-0 h-[180px]" />
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-5 pt-10 pb-4 border-b border-[#F0F0F0]">
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color="#1E1E1E" />
                            </TouchableOpacity>
                            <Text className="text-[16px] font-bold text-[#1E1E1E]">Upload a site progress</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* Photo Picker */}
                            <TouchableOpacity
                                onPress={showPhotoOptions}
                                className="items-center justify-center rounded-[16px] border-2 border-dashed border-[#D3D0FF] bg-[#F8F7FF] mb-6"
                                style={{ height: 160 }}
                            >
                                {photoUri ? (
                                    <Image source={{ uri: photoUri }} style={{ width: "100%", height: 160, borderRadius: 14 }} resizeMode="cover" />
                                ) : (
                                    <>
                                        <View className="w-14 h-14 rounded-full bg-[#EAE8FF] items-center justify-center mb-2">
                                            <Ionicons name="camera" size={26} color={PRIMARY} />
                                        </View>
                                        <Text className="text-[13px] text-[#A3A3A3]">Tap to upload photo</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">From</Text>
                            <TextInput value={partner} onChangeText={setPartner} style={inputStyle} placeholder="Your name / company" placeholderTextColor="#C0C0C0" />

                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Location</Text>
                            <TextInput value={location} onChangeText={setLocation} style={inputStyle} placeholder="Site location" placeholderTextColor="#C0C0C0" />

                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Milestone</Text>
                            <TextInput value={milestone} onChangeText={setMilestone} style={inputStyle} placeholder="e.g. Foundation complete" placeholderTextColor="#C0C0C0" />

                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Notes</Text>
                            <TextInput
                                value={notes} onChangeText={setNotes}
                                style={{ ...inputStyle, height: 80, textAlignVertical: "top", paddingTop: 12 }}
                                placeholder="Additional notes..." placeholderTextColor="#C0C0C0" multiline
                            />
                        </ScrollView>

                        {/* Footer Buttons */}
                        <View className="flex-row px-5 pb-10 pt-3 border-t border-[#F0F0F0] gap-3">
                            <TouchableOpacity onPress={handleClose} className="flex-1 h-12 rounded-[14px] border border-[#E0E0E0] items-center justify-center">
                                <Text className="text-[14px] font-semibold text-[#777]">Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => photoUri ? setStep(2) : setStep(3)}
                                className="flex-1 h-12 rounded-[14px] items-center justify-center"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                <Text className="text-[14px] font-bold text-white">Next</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ── STEP 2: Full Photo Preview ── */}
                {step === 2 && photoUri && (
                    <View className="flex-1">
                        {/* Back button */}
                        <TouchableOpacity onPress={() => setStep(1)} className="absolute top-12 left-5 z-10 w-9 h-9 rounded-full bg-white items-center justify-center"
                            style={{ shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 }}>
                            <Ionicons name="chevron-back" size={20} color="#1E1E1E" />
                        </TouchableOpacity>
                        <Text className="absolute top-14 self-center text-[16px] font-bold text-[#1E1E1E] z-10">Upload Site Progress</Text>

                        <Image source={{ uri: photoUri }} style={{ flex: 1 }} resizeMode="cover" />

                        {/* Add more photos label */}
                        <TouchableOpacity onPress={showPhotoOptions} className="absolute bottom-28 self-center bg-white rounded-full px-4 py-2 flex-row items-center"
                            style={{ shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 }}>
                            <Ionicons name="add-circle-outline" size={16} color={PRIMARY} />
                            <Text className="text-[13px] text-[#7370FF] font-semibold ml-1">add more photo</Text>
                        </TouchableOpacity>

                        <View className="absolute bottom-10 left-5 right-5">
                            <TouchableOpacity
                                onPress={() => setStep(3)}
                                className="h-14 rounded-[16px] items-center justify-center"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                <Text className="text-[16px] font-bold text-white">Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* ── STEP 3: Form Details ── */}
                {step === 3 && (
                    <>
                        <View className="flex-row items-center px-5 pt-10 pb-4 border-b border-[#F0F0F0]">
                            <TouchableOpacity onPress={() => setStep(photoUri ? 2 : 1)}>
                                <Ionicons name="chevron-back" size={24} color="#1E1E1E" />
                            </TouchableOpacity>
                            <Text className="text-[16px] font-bold text-[#1E1E1E] ml-3">Upload Site Progress</Text>
                        </View>

                        {/* Mini photo preview if available */}
                        {photoUri && (
                            <Image source={{ uri: photoUri }} style={{ width: "100%", height: 200 }} resizeMode="cover" />
                        )}

                        <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Project name</Text>
                            <TextInput value={projectName} onChangeText={setProjectName} style={inputStyle} placeholder="Enter project name" placeholderTextColor="#C0C0C0" />

                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Partner (from)</Text>
                            <TextInput value={partner} onChangeText={setPartner} style={inputStyle} placeholder="Your name / company" placeholderTextColor="#C0C0C0" />

                            <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Notes</Text>
                            <TextInput
                                value={notes} onChangeText={setNotes}
                                style={{ ...inputStyle, height: 100, textAlignVertical: "top", paddingTop: 12 }}
                                placeholder="Add notes about this progress update..." placeholderTextColor="#C0C0C0" multiline
                            />
                        </ScrollView>

                        <View className="px-5 pb-10 pt-3 border-t border-[#F0F0F0]">
                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={saving}
                                className="h-14 rounded-[16px] items-center justify-center"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                {saving ? <ActivityIndicator color="white" /> : (
                                    <Text className="text-[16px] font-bold text-white">Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* ── STEP 4: Success ── */}
                {step === 4 && (
                    <View className="flex-1 items-center justify-center px-8">
                        <LinearGradient colors={["rgba(115,112,255,0.12)", "rgba(255,255,255,0)"]}
                            className="absolute top-0 left-0 right-0 h-[300px]" />

                        <View className="w-24 h-24 rounded-full bg-[#7370FF] items-center justify-center mb-6"
                            style={{ shadowColor: "#7370FF", shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 }}>
                            <Ionicons name="checkmark" size={48} color="white" />
                        </View>

                        <Text className="text-[22px] font-bold text-[#1E1E1E] mb-3 text-center">Site progress uploaded!</Text>
                        <Text className="text-[14px] text-[#A3A3A3] text-center leading-6 mb-10">
                            Photo(s) uploaded and added to{"\n"}
                            <Text className="font-semibold text-[#1E1E1E]">{projectName}</Text> site updates.
                        </Text>

                        <TouchableOpacity
                            onPress={handleClose}
                            className="w-full h-14 rounded-[16px] items-center justify-center"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            <Text className="text-[16px] font-bold text-white">Back to home</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
}
