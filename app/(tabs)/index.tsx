// src/screens/NewChatScreen.tsx
import FileIcon from "@/assets/icon/document.svg";
import Flash from "@/assets/icon/flash.svg";

import LargeLogo from "@/assets/icon/large_logo.svg";
import Library from "@/assets/icon/library.svg";
import BackupCard from "@/components/BackUp";
import TopHeader from "@/components/Header";
import RecentChatRow, { recent } from "@/components/RecentChats";
import { SideMenu } from "@/components/SlideMenu";
import CyclingWordMoti from "@/components/ui/CyclingWord";
import UploadSheet from "@/components/UploadSheet";
import Chip from "@/src/ui/Chip";

import { Ionicons as Ion } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SIDEBAR_WIDTH = 260;

export default function NewChatScreen({ navigation }: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [text, setText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSideMenu, setSideMenu] = useState(false);
  const [open, setOpen] = useState(false);
  // sidebar animation
  const anim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const toggleSidebar = useCallback(
    (open: boolean) => {
      Animated.timing(anim, {
        toValue: open ? 0 : -SIDEBAR_WIDTH,
        duration: 240,
        useNativeDriver: true,
      }).start(() => setSidebarOpen(open));
    },
    [anim]
  );

  useEffect(() => {
    Animated.timing(anim, {
      toValue: sidebarOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [sidebarOpen, anim]);

  const chipItems = useMemo(
    () => [
      {
        label: "Summarize text",
        icon: <Ion name="color-wand-outline" color="#3B82F6" size={14} />,
        onPress: () => setText("Summarize text"),
      },
      {
        label: "Analyze PDF",
        icon: <Ion name="albums-outline" color="#3B82F6" size={14} />,
        onPress: () => navigation.navigate("Upload"),
      },
      {
        label: "Analyze image",
        icon: <Ion name="images-outline" color="#3B82F6" size={14} />,
        onPress: () => navigation.navigate("Upload"),
      },
      {
        label: "Help me write",
        icon: <Ion name="bulb-outline" color="#3B82F6" size={14} />,
      },
    ],
    [navigation]
  );

  return (
    <View className="flex-1 bg-[#111111]">
      <LinearGradient
        colors={["#111111", "#0B152360"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        className="flex-1"
      >
        {/* Sidebar */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 20,
            width: SIDEBAR_WIDTH,
            transform: [{ translateX: anim }],
          }}
        ></Animated.View>

        {/* Overlay */}
        {sidebarOpen && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => toggleSidebar(false)}
            className="absolute inset-0 bg-black/40 z-10"
          />
        )}

        {/* Main body */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-1 justify-between">
            {/* Scrollable content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName="px-4 pt-4 pb-6"
            >
              <TopHeader onMenu={() => setSideMenu(true)} />

              <View className="flex-col my-6 gap-4">
                <Text className="text-white/60 font-semibold text-xl">
                  Hi, Praveen!
                </Text>

                <View className="flex-row items-center">
                  <View className="flex-1 pr-3">
                    <CyclingWordMoti
                      prefix="Bring your "
                      suffix="I’ll build the brain"
                      interval={1600}
                      fontSize={28}
                      lineHeight={36}
                      staticColor="#FFFFFF"
                    />
                  </View>
                  <LargeLogo width={68} height={68} />
                </View>
              </View>

              {/* Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex-row items-center gap-2 mb-4"
              >
                {chipItems.map((c) => (
                  <Chip
                    key={c.label}
                    label={c.label}
                    icon={c.icon}
                    onPress={c.onPress}
                  />
                ))}
              </ScrollView>

              {/* Cards */}
              <View className="gap-4">
                <TouchableOpacity
                  activeOpacity={0.85}
                  className="flex-row items-center justify-between rounded-xl p-5"
                  style={{ backgroundColor: "#FFFFFF10" }}
                >
                  <View className="flex-row items-center">
                    <FileIcon width={28} />
                    <View className="ml-3">
                      <Text className="text-white font-semibold text-lg">
                        Ask from File
                      </Text>
                      <Text className="text-white/70 text-sm mt-0.5">
                        Chat with any uploaded content
                      </Text>
                    </View>
                  </View>
                  <Ion name="chevron-forward" size={18} color="#fff" />
                </TouchableOpacity>
                <View className="flex-row gap-4">
                  <ActionCard
                    bg="#FFFFFF10"
                    icon={<Library width={28} />}
                    title="All Files"
                    arrow={true}
                    onPress={() => setOpen(true)}
                  />
                  <ActionCard
                    bg="#FFFFFF10"
                    icon={<Flash width={28} />}
                    title="Quick Ask"
                    onPress={() => router.navigate("/(features)/quickChat")}
                  />
                </View>

                <RecentChatRow
                  title="Recent Chat"
                  data={recent}
                  onPressItem={(item) => console.log("Open:", item)}
                />

                <BackupCard action="synced" />
              </View>
            </ScrollView>

            {/* Fixed bottom Upload button */}
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
      <SideMenu open={openSideMenu} onClose={() => setSideMenu(false)} />
      <KeyboardAvoidingView>
        <UploadSheet
          visible={open}
          onClose={() => setOpen(false)}
          onConfirm={(payload) => {
            console.log("confirm:", payload);
            setOpen(false);
          }}
          onPickFile={() => console.log("pick file")}
          defaultName="Maths Notes"
          defaultDescription="Maths Notes"
          maxDescription={100}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- small, neat pieces ---------- */

function ActionCard({
  bg,
  icon,
  title,
  arrow,
  onPress,
}: {
  bg: string;
  icon: React.ReactNode;
  title: string;
  arrow?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="flex-1 flex-row items-center justify-start rounded-xl p-5"
      style={{ backgroundColor: bg }}
    >
      {arrow ? (
        <View className="flex-1 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center justify-start">
            {icon}
            <Text className="text-white font-semibold text-lg ml-3">
              {title}
            </Text>
          </View>
          <Ion name="chevron-forward" size={18} color="#fff" />
        </View>
      ) : (
        <View className="flex-1 flex-row items-center justify-start">
          {icon}
          <Text className="text-white font-semibold text-lg ml-3">{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
