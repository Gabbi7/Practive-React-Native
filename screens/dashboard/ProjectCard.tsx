import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProjectCardProps {
    name: string;
    location: string;
    color: string;
    progress?: number;
    image?: ImageSourcePropType;
}

export default function ProjectCard({ name, location, color, progress = 60, image }: ProjectCardProps) {
    // Extract hex from bg-[#XXX] or use a default
    const bgMap: Record<string, string> = {
        "bg-[#FFD6F3]": "#FFD6F3",
        "bg-[#E5D4FF]": "#E5D4FF",
        "bg-[#D4E5FF]": "#D4E5FF",
    };
    const bannerColor = bgMap[color] || "#FFD6F3";

    return (
        <View
            className="bg-white rounded-[20px] mb-4 overflow-hidden border border-gray-100"
            style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 }}
        >
            {/* Banner */}
            <View style={{ backgroundColor: bannerColor, height: 200 }}>
                {image && (
                    <Image 
                        source={image} 
                        className="w-full h-full absolute inset-0" 
                        resizeMode="cover" 
                        fadeDuration={300}
                    />
                )}
                {/* 3-dot menu */}
                <TouchableOpacity className="absolute top-3 right-3 p-1">
                    <Ionicons name="ellipsis-vertical" size={18} color={image ? "white" : "#888"} />
                </TouchableOpacity>
            </View>

            {/* Card Footer */}
            <View className="px-4 pt-3 pb-4">
                <View className="flex-row items-center mb-1">
                    <View className="w-5 h-5 rounded-full bg-[#EAE8FF] items-center justify-center mr-2">
                        <Ionicons name="construct-outline" size={11} color="#7370FF" />
                    </View>
                    <Text className="text-[13px] font-semibold text-[#1E1E1E]">{name}</Text>
                </View>
                <Text className="text-[11px] text-[#A3A3A3] ml-7 mb-3">{location}</Text>

                {/* Progress bar */}
                <View className="h-[5px] bg-[#F0F0F0] rounded-full overflow-hidden">
                    <View
                        style={{ width: `${progress}%`, backgroundColor: "#7370FF" }}
                        className="h-full rounded-full"
                    />
                </View>
                <Text className="text-[10px] text-[#A3A3A3] mt-1 text-right">{progress}% complete</Text>
            </View>
        </View>
    );
}
