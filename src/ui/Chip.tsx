// src/ui/Chip.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
  selected?: boolean;
};

export default function Chip({ icon, label, onPress, selected = false }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`
        flex-row items-center rounded-full border
        px-3 py-1.5
        ${selected
          ? "bg-[#1E3A8A]/60 border-[#3B82F6]"
          : "bg-white/5 border-white/15"}
      `}
    >
      {icon && <View className="mr-1.5">{icon}</View>}
      <Text
        className={`text-[13px] font-medium ${
          selected ? "text-white" : "text-white/80"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
