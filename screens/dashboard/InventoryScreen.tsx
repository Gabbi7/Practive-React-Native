import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../lib/api";

interface InventoryItem {
    id: number;
    item_name: string;
    category: string;
    quantity: string;
    critical_level: string;
    price: string;
    unit: string;
}

interface Props {
    projectId: number;
    onBack: () => void;
}

const categoryColor: Record<string, string> = {
    Materials: "#FFF3B0",
    Equipment: "#FFD6F3",
    Tools: "#D6F3FF",
};

function stockStatus(qty: string, critical: string): { label: string; color: string; text: string } {
    const q = parseInt(qty) || 0;
    const c = parseInt(critical) || 0;
    if (q <= 0) return { label: "Out of Stock", color: "#FF6B6B", text: "white" };
    if (q <= c) return { label: "Low Stock", color: "#FF6B6B", text: "white" };
    return { label: "In Stock", color: "#51CF66", text: "white" };
}

export default function InventoryScreen({ projectId, onBack }: Props) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Add modal
    const [showAdd, setShowAdd] = useState(false);
    const [addName, setAddName] = useState("");
    const [addCategory, setAddCategory] = useState("Materials");
    const [addQty, setAddQty] = useState("");
    const [addCritical, setAddCritical] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addUnit, setAddUnit] = useState("");
    const [saving, setSaving] = useState(false);

    // Update modal
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [editName, setEditName] = useState("");
    const [editQty, setEditQty] = useState("");

    const load = () => {
        setLoading(true);
        fetch(`${API_URL}/inventory?projectId=${projectId}`)
            .then(r => r.json())
            .then(d => { setItems(d); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { load(); }, [projectId]);

    const handleAdd = async () => {
        if (!addName.trim()) { Alert.alert("Required", "Item name is required."); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/inventory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId, itemName: addName, category: addCategory, quantity: `${addQty} ${addUnit}`, criticalLevel: `${addCritical} ${addUnit}`, price: `P${addPrice}`, unit: addUnit }),
            });
            if (res.ok) { load(); setShowAdd(false); setAddName(""); setAddQty(""); setAddCritical(""); setAddPrice(""); setAddUnit(""); }
        } finally { setSaving(false); }
    };

    const handleUpdate = async () => {
        if (!editItem) return;
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/inventory/${editItem.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemName: editName, quantity: editQty }),
            });
            if (res.ok) { load(); setEditItem(null); }
        } finally { setSaving(false); }
    };

    const handleDelete = (id: number) => {
        Alert.alert("Delete Item", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive", onPress: async () => {
                    await fetch(`${API_URL}/inventory/${id}`, { method: "DELETE" });
                    load();
                }
            }
        ]);
    };

    const inputStyle = {
        borderWidth: 1, borderColor: "#E7E7EE", borderRadius: 12,
        paddingHorizontal: 14, height: 48, backgroundColor: "#FAFAFA",
        fontSize: 14, color: "#1E1E1E", marginBottom: 10,
    } as const;

    return (
        <View className="flex-1 bg-[#F5F5F7]">
            {/* Header */}
            <View className="flex-row items-center px-5 pt-14 pb-4 bg-[#F5F5F7]">
                <TouchableOpacity onPress={onBack} className="mr-3">
                    <Ionicons name="chevron-back" size={26} color="#7370FF" />
                </TouchableOpacity>
                <Text className="text-[26px] font-bold text-[#7370FF]">Inventory</Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
                onPress={() => setShowAdd(true)}
                className="mx-5 mb-4 h-[52px] rounded-[14px] items-center justify-center"
                style={{ backgroundColor: "#7370FF" }}
            >
                <Text className="text-white font-bold text-[16px]">Add an Item</Text>
            </TouchableOpacity>

            {/* List */}
            {loading ? (
                <ActivityIndicator color="#7370FF" size="large" className="mt-10" />
            ) : (
                <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 120 }}>
                    {items.map(item => {
                        const status = stockStatus(item.quantity, item.critical_level);
                        const catColor = categoryColor[item.category] || "#F0F0F0";
                        return (
                            <View key={item.id} className="bg-white rounded-[16px] p-4 mb-3 border border-[#F0F0F0]"
                                style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center flex-1">
                                        <Text className="text-[16px] font-bold text-[#1E1E1E] mr-2">{item.item_name}</Text>
                                        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: status.color }}>
                                            <Text className="text-[10px] font-bold" style={{ color: status.text }}>{status.label}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => Alert.alert(item.item_name, "Choose action", [
                                            { text: "Update", onPress: () => { setEditItem(item); setEditName(item.item_name); setEditQty(item.quantity); } },
                                            { text: "Delete", style: "destructive", onPress: () => handleDelete(item.id) },
                                            { text: "Cancel", style: "cancel" }
                                        ])}
                                    >
                                        <Ionicons name="ellipsis-vertical" size={18} color="#C0C0C0" />
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row justify-between">
                                    <View>
                                        <View className="px-2 py-1 rounded-full mb-1" style={{ backgroundColor: catColor, alignSelf: "flex-start" }}>
                                            <Text className="text-[11px] font-semibold text-[#5A5A5A]">{item.category}</Text>
                                        </View>
                                        <Text className="text-[10px] text-[#A3A3A3]">Category</Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-[13px] font-semibold text-[#1E1E1E]">{item.quantity}</Text>
                                        <Text className="text-[10px] text-[#A3A3A3]">In Stock</Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-[13px] font-semibold text-[#1E1E1E]">{item.critical_level}</Text>
                                        <Text className="text-[10px] text-[#A3A3A3]">Critical Level</Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-[13px] font-semibold text-[#1E1E1E]">{item.price}</Text>
                                        <Text className="text-[10px] text-[#A3A3A3]">Price</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            {/* ADD ITEM MODAL */}
            <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
                <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                    <View className="bg-white rounded-t-[24px] px-5 pt-5 pb-10">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-[18px] font-bold text-[#7370FF]">Add an Item</Text>
                            <TouchableOpacity onPress={() => setShowAdd(false)}>
                                <Ionicons name="close" size={22} color="#A3A3A3" />
                            </TouchableOpacity>
                        </View>
                        <TextInput value={addName} onChangeText={setAddName} style={inputStyle} placeholder="Item Name" placeholderTextColor="#C0C0C0" />
                        <TextInput value={addCategory} onChangeText={setAddCategory} style={inputStyle} placeholder="Category (Materials / Equipment)" placeholderTextColor="#C0C0C0" />
                        <View className="flex-row gap-2">
                            <TextInput value={addQty} onChangeText={setAddQty} style={{ ...inputStyle, flex: 1 }} placeholder="Qty" placeholderTextColor="#C0C0C0" keyboardType="numeric" />
                            <TextInput value={addUnit} onChangeText={setAddUnit} style={{ ...inputStyle, flex: 1 }} placeholder="Unit (bags/pcs)" placeholderTextColor="#C0C0C0" />
                        </View>
                        <TextInput value={addCritical} onChangeText={setAddCritical} style={inputStyle} placeholder="Critical Level (number)" placeholderTextColor="#C0C0C0" keyboardType="numeric" />
                        <TextInput value={addPrice} onChangeText={setAddPrice} style={inputStyle} placeholder="Price (e.g. 100)" placeholderTextColor="#C0C0C0" keyboardType="numeric" />
                        <TouchableOpacity onPress={handleAdd} disabled={saving} className="h-12 rounded-[14px] items-center justify-center mt-2" style={{ backgroundColor: "#7370FF" }}>
                            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-[15px]">Save Item</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* UPDATE ITEM MODAL */}
            <Modal visible={!!editItem} transparent animationType="fade" onRequestClose={() => setEditItem(null)}>
                <View className="flex-1 items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                    <View className="bg-white rounded-[20px] mx-6 p-5 w-full max-w-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-[17px] font-bold text-[#7370FF]">Update an Item</Text>
                            <TouchableOpacity onPress={() => setEditItem(null)}>
                                <Ionicons name="close" size={22} color="#A3A3A3" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Item Name</Text>
                        <TextInput value={editName} onChangeText={setEditName} style={inputStyle} placeholder="Item Name" placeholderTextColor="#C0C0C0" />
                        <Text className="text-[12px] font-semibold text-[#2D2D2D] mb-1">Current Stock</Text>
                        <TextInput value={editQty} onChangeText={setEditQty} style={inputStyle} placeholder="e.g. 20 bags" placeholderTextColor="#C0C0C0" />
                        <TouchableOpacity onPress={handleUpdate} disabled={saving} className="h-12 rounded-[14px] items-center justify-center mt-2" style={{ backgroundColor: "#7370FF" }}>
                            {saving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-[15px]">Save</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
