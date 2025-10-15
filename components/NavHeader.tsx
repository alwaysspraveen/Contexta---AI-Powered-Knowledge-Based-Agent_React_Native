// src/components/TopHeader.tsx
import Incognito from "@/assets/icon/incognito.svg";
import { Ionicons as Ion } from "@expo/vector-icons";

import Shine from "@/assets/icon/shine.svg";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
type Props = {
  title: boolean;
  onPress: () => void;
};
export default function NavHeader({ title, onPress }: Props) {
  const toggleSidebar = () => {
    // Implement your sidebar open logic here
    console.log("Sidebar opened");
  };

  return (
    <View className={`flex-row items-center justify-between pb-1`}>
      {/* Left Menu Button */}
      <TouchableOpacity
        className="p-3 rounded-full active:opacity-70 bg-[#ffffff10] z-20"
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ion name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>

      {/* Center CTA */}
      <TouchableOpacity className="flex-row items-center gap-1.5 px-3.5 py-3 rounded-full bg-[#1630B260] active:opacity-80">
        {/* <Shine width={22} height={22} color="#B5C1FF" /> */}
        <Shine width={22} color="#B5C1FF" />
        <Text className="text-[#B5C1FF] text-base font-semibold">Get Plus</Text>
      </TouchableOpacity>

      {/* Right Settings Icon */}
      <TouchableOpacity
        className="p-3 rounded-full active:opacity-70 bg-[#ffffff10] z-20"
        onPress={toggleSidebar}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Incognito width={22} height={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
