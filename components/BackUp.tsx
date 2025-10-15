import DriveBackup from "@/assets/icon/drive_backup.svg";
import DriveRestore from "@/assets/icon/drive_restore.svg";
import DriveSync from "@/assets/icon/drive_success.svg";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
type Action = "backup" | "restore" | "synced";

type Props = {
  title?: string;
  action: Action;
  onPress?: () => void; // used for backup/restore
  lastSyncText?: string; // e.g. "Last sync 9:40 AM" (for synced)
  tint?: "blue" | "yellow" | "green"; // changes cloud icon color
  disabled?: boolean;
  className?: string;
};

const tintMap = {
  blue: "#3B82F6",
  yellow: "#FACC15",
  green: "#22C55E",
};

export default function BackupCard({
  title = "Drive backup",
  action,
  onPress,
  lastSyncText,
  tint = "blue",
  disabled = false,
  className = "",
}: Props) {
  const color = tintMap[tint];

  return (
    <>
      <Text className="text-white/80 font-semibold text-base">{title}</Text>
      <View className={`w-full rounded-xl bg-white/5 p-4 ${className}`}>
        <View className="flex-row items-center">
          {/* Left: cloud icon */}
          <View className="w-14 h-14 items-center justify-center shrink-0">
            {action === "backup" && (
              <DriveBackup width={30} height={30} color={color} />
            )}
            {action === "restore" && (
              <DriveRestore width={30} height={30} color={color} />
            )}
            {action === "synced" && (
              <DriveSync width={30} height={30} color={color} />
            )}
          </View>

          {/* Title */}
          <View className="flex-1">
            <Text
              className="text-white text-lg font-semibold"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          {/* Right side: action or synced status */}
          {action === "synced" ? (
            <View className="flex-row items-center">
              <Text className="text-white/80 text-base mr-2" numberOfLines={1}>
                {lastSyncText ?? "Last sync just now"}
              </Text>
              <Ionicons name="checkmark" size={18} color={tintMap.green} />
            </View>
          ) : (
            <Pressable
              disabled={disabled}
              onPress={onPress}
              className={`px-4 py-2 rounded-lg bg-white ${
                disabled ? "opacity-50" : ""
              }`}
              android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
            >
              <Text className="text-black font-semibold">
                {action === "backup" ? "Back up" : "Restore"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}
