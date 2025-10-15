// components/RecentChatRow.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export type RecentItem = {
  id: string;
  title: string;
  subtitle?: string;
  // optional override icon color per item
  color?: string;
};

type Props = {
  title?: string; // section title (e.g., "Recent Chat")
  data: RecentItem[]; // items to render (HORIZONTAL)
  onPressItem?: (item: RecentItem) => void;
  containerClassName?: string; // optional extra classes for wrapper
};

function RecentCard({
  item,
  onPress,
}: {
  item: RecentItem;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[300px] mr-4 rounded-xl bg-white/5 p-4 flex-row items-center"
      android_ripple={{ color: "rgba(255,255,255,0.06)", borderless: false }}
    >
      {/* leading icon */}
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-3">
        <Ionicons
          name="document-text-outline"
          size={26}
          color={item.color ?? "#9FB4FF"}
        />
      </View>

      {/* text block */}
      <View className="flex-1">
        <Text
          className="text-white text-lg font-semibold"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text className="text-white/60 text-sm mt-0.5" numberOfLines={1}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>

      {/* chevron */}
      <Ionicons name="chevron-forward" size={18} color="#ffffff" />
    </Pressable>
  );
}

export default function RecentChatRow({
  title = "Recent Chat",
  data,
  onPressItem,
  containerClassName = "",
}: Props) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {/* section title */}
      <Text className="text-white/80 font-semibold text-base mb-3">
        {title}
      </Text>

      {/* horizontal list */}
      <FlatList
        horizontal
        data={data}
        keyExtractor={(it) => it.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <RecentCard item={item} onPress={() => onPressItem?.(item)} />
        )}
      />
    </View>
  );
}

export const recent: RecentItem[] = [
  {
    id: "1",
    title: "Maths Notes",
    subtitle: "Class_A_Maths.pdf",
    color: "#9FB4FF",
  },
  {
    id: "2",
    title: "Physics Quiz",
    subtitle: "Chapter_5.pdf",
    color: "#6EE7B7",
  },
  {
    id: "3",
    title: "History Outline",
    subtitle: "WWII_notes.docx",
    color: "#FDE68A",
  },
];
