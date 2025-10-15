// src/screens/NewChatScreen.tsx
import TopHeader from "@/components/Header";
import Chip from "@/src/ui/Chip";
import { colors } from "@/src/ui/theme";
import { Entypo, Ionicons as Ion } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SIDEBAR_WIDTH = 260;
const EDGE_SWIPE_WIDTH = 24;

export default function NewChatScreen({ navigation }: any) {
  // ----------------- STATE -----------------
  const [text, setText] = useState("");
  const [attach, setAttach] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();

  // ----------------- ANIMATION SETUP -----------------
  const anim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const toggleSidebar = (open: boolean) => {
    Animated.timing(anim, {
      toValue: open ? 0 : -SIDEBAR_WIDTH,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setSidebarOpen(open));
  };

  // restore sidebar instantly when screen mounts
  useEffect(() => {
    Animated.timing(anim, {
      toValue: sidebarOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 0,
      useNativeDriver: true,
    }).start();
    return () => anim.stopAnimation(); // prevents white flash on unmount
  }, [sidebarOpen, anim]);

  // ----------------- PAN SWIPE -----------------
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        const edgeSwipe = g.moveX <= EDGE_SWIPE_WIDTH && g.dx > 8;
        const closeSwipe = sidebarOpen && g.dx < -8;
        return edgeSwipe || closeSwipe;
      },
      onPanResponderMove: (_, g) => {
        if (!sidebarOpen && g.dx > 0) {
          const v = Math.min(
            Math.max(-SIDEBAR_WIDTH + g.dx, -SIDEBAR_WIDTH),
            0
          );
          anim.setValue(v);
        } else if (sidebarOpen && g.dx < 0) {
          const v = Math.min(Math.max(g.dx, -SIDEBAR_WIDTH), 0);
          anim.setValue(v);
        }
      },
      onPanResponderRelease: (_, g) => {
        const { dx, vx } = g;
        if (!sidebarOpen) {
          const openedEnough = dx > SIDEBAR_WIDTH / 2 || vx > 0.25;
          toggleSidebar(openedEnough);
        } else {
          const stillOpen = dx > -SIDEBAR_WIDTH / 3 && vx > -0.25;
          toggleSidebar(stillOpen);
        }
      },
    })
  ).current;


  // ----------------- HANDLERS -----------------
  const openAttach = () => {
    setAttach(true);
    navigation?.navigate?.("Upload");
  };

  const onSend = () => {
    if (!text.trim()) return;
    navigation.navigate("Chat", { first: text });
    setText("");
  };

  // ----------------- RENDER -----------------
  return (
    <View
      style={{ flex: 1 }} // ensures no white flash
    >
      <LinearGradient
        colors={["#111111", "#0B1523"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Dim overlay */}
        {sidebarOpen && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => toggleSidebar(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 10,
            }}
          />
        )}

        {/* Edge swipe catcher */}
        {!sidebarOpen && (
          <View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 16,
              width: EDGE_SWIPE_WIDTH,
              height: "100%",
            }}
            pointerEvents="box-only"
          />
        )}

        {/* Main content */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 16 }}
            {...(sidebarOpen ? panResponder.panHandlers : {})}
          >
            {/* Header */}
            <TopHeader />

            {/* Greeting */}
            <View style={{ alignItems: "center", marginTop: 80, gap: 8 }}>
              <Text
                style={{ color: "#ffffff99", fontSize: 22, fontWeight: "500" }}
              >
                Hi, Praveen
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 34,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                How can I help you?
              </Text>
            </View>

            {/* Quick actions */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 12,
                paddingVertical: 16,
                gap: 10,
              }}
              style={{ marginTop: 20 }}
            >
              <Chip
                onPress={() => setText("Summarize text")}
                icon={
                  <Ion name="color-wand-outline" color="#0CB500" size={16} />
                }
                label="Summarize text"
              />
              <Chip
                icon={<Ion name="albums-outline" color="#3588FE" size={16} />}
                label="Analyze PDF"
                onPress={() => navigation.navigate("Upload")}
              />
              <Chip
                icon={
                  <Ion name="images-outline" color={colors.text} size={16} />
                }
                label="Analyze image"
                onPress={() => navigation.navigate("Upload")}
              />
              <Chip
                icon={<Ion name="bulb-outline" color={colors.text} size={16} />}
                label="Help me write"
              />
            </ScrollView>

            <View style={{ flex: 1 }} />

            {/* Input bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 8,
                paddingBottom: Math.max(bottom, 8),
              }}
            >
              <TouchableOpacity
                onPress={() => setAttach((p) => !p)}
                activeOpacity={0.8}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {attach ? (
                  <Entypo name="cross" size={24} color={colors.text} />
                ) : (
                  <Entypo name="plus" size={22} color={colors.text} />
                )}
              </TouchableOpacity>

              <TextInput
                style={{
                  flex: 1,
                  minHeight: 44,
                  maxHeight: 120,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "#fff",
                }}
                placeholder="Ask Anything"
                placeholderTextColor={colors.sub}
                value={text}
                onChangeText={setText}
                multiline
                returnKeyType="send"
                onSubmitEditing={onSend}
              />

              <TouchableOpacity
                onPress={onSend}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: "#4C64FF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ion
                  name={text.trim() ? "send" : "mic-outline"}
                  size={18}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {/* Attachment Row */}
            {attach && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingHorizontal: 12,
                  paddingTop: 6,
                  paddingBottom: Math.max(bottom, 12),
                }}
              >
                <AttachCard
                  icon="camera-outline"
                  label="Photo"
                  onPress={openAttach}
                />
                <AttachCard
                  icon="image-outline"
                  label="Image"
                  onPress={openAttach}
                />
                <AttachCard
                  icon="document-outline"
                  label="Files"
                  onPress={openAttach}
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

// --------------- SMALL COMPONENTS ---------------
function AttachCard({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        flex: 1,
        height: 86,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "rgba(255,255,255,0.1)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 6,
        }}
      >
        <Ion name={icon as any} size={26} color={colors.text} />
      </View>
      <Text style={{ color: "#fff", fontSize: 14 }}>{label}</Text>
    </TouchableOpacity>
  );
}
