// components/SmoothSideMenu.tsx
import Shine from "@/assets/icon/shine.svg";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { ReactNode, useEffect } from "react";
import {
    BackHandler,
    Image,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
// ——— assets used by the SideMenu wrapper (safe to keep here) ———
import SideLogo from "@/assets/icon/Side_Logo.svg";
import About from "@/assets/icon/menu/about.svg";
import BackUp from "@/assets/icon/menu/cloud-upload-svgrepo-com 1.svg";
import Chat from "@/assets/icon/menu/message-text.svg";
import Profile from "@/assets/icon/menu/profile.svg";
import Settins from "@/assets/icon/menu/setting-2.svg";
import Upgrade from "@/assets/icon/menu/shield-tick.svg";
// ========================= Types =========================
type MenuItem = {
  key: string;
  label: string;
  icon?: ReactNode | keyof typeof Ionicons.glyphMap; // custom node or Ionicons name
  onPress?: () => void;
  right?: ReactNode; // badge/chevron/etc.
  danger?: boolean;
};

type SmoothProps = {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
  header?: ReactNode; // avatar/name block
  footer?: ReactNode; // theme switcher, etc.
  width?: number; // default 300
};

const MENU_WIDTH_DEFAULT = 300;

// Helper: render icon consistently (node OR ion name)
const RenderIcon = ({
  icon,
  danger,
}: {
  icon?: MenuItem["icon"];
  danger?: boolean;
}) => {
  if (!icon) return <View style={{ width: 18 }} />;
  if (typeof icon === "string") {
    return (
      <Ionicons
        name={icon as any}
        size={18}
        color={danger ? "#ff6b6b" : "#ffffff"}
      />
    );
  }
  // Wrap custom nodes so row height stays consistent
  return (
    <View
      style={{
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </View>
  );
};

// ========================= Base Component =========================
export default function SmoothSideMenu({
  visible,
  onClose,
  items,
  header,
  footer,
  width = MENU_WIDTH_DEFAULT,
}: SmoothProps) {
  const { top, bottom } = useSafeAreaInsets();

  // progress: 0 = open, 1 = closed
  const progress = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(0, { duration: 260 });
    } else {
      progress.value = 1;
    }
  }, [progress, visible]);

  // Android back button closes when visible
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const close = () => {
    progress.value = withTiming(1, { duration: 300 }, (f) => {
      if (f) runOnJS(onClose)();
    });
  };

  // Drag to dismiss (swipe left)
  // translateX: 0 (open) -> -width (closed)
  const drag = Gesture.Pan()
    .onChange((e) => {
      // convert horizontal movement to progress delta
      // dragging LEFT (e.changeX < 0) should INCREASE progress towards 1
      const deltaProg = -e.changeX / width;
      const next = Math.min(1, Math.max(0, progress.value + deltaProg));
      progress.value = next;
    })
    .onEnd((e) => {
      const shouldClose = progress.value > 0.25 || e.velocityX < -700;
      progress.value = withTiming(
        shouldClose ? 1 : 0,
        { duration: 200 },
        (f) => {
          if (f && shouldClose) runOnJS(onClose)();
        }
      );
    });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0.55, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const sheetStyle = useAnimatedStyle(() => {
    const tx = interpolate(
      progress.value,
      [0, 1],
      [0, -width],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateX: tx }] };
  });

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View
        style={[
          {
            position: "absolute",
            inset: 0,
            backgroundColor: "black",
          },
          backdropStyle,
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      {/* Panel */}
      <GestureDetector gesture={drag}>
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width,
              backgroundColor: "#0B0F14", // dark panel
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              overflow: "hidden",
            },
            sheetStyle,
          ]}
        >
          <SafeAreaView
            edges={["top", "left", "bottom"]}
            style={{ flex: 1, paddingTop: Math.max(top, 8) }}
          >
            {/* Header */}
            <View className="px-4 pb-3 pt-2">
              {header ?? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-full bg-white/10 items-center justify-center">
                      <Ionicons
                        name="sparkles-outline"
                        size={18}
                        color="#fff"
                      />
                    </View>
                    <View>
                      <Text className="text-white text-lg font-semibold">
                        Contexta
                      </Text>
                      <Text className="text-white/50 text-xs">Menu</Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={close}
                    className="w-9 h-9 rounded-full bg-white/10 items-center justify-center"
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Close menu"
                  >
                    <Ionicons name="close" size={18} color="#fff" />
                  </Pressable>
                </View>
              )}
            </View>

            <View className="h-[1px] bg-white/10 mx-4" />

            {/* Items */}
            <View className="pt-2">
              {items.map((it) => (
                <Pressable
                  key={it.key}
                  onPress={() => {
                    it.onPress?.();
                    close();
                  }}
                  className="flex-row items-center justify-between px-4 py-4"
                  android_ripple={{ color: "rgba(255,255,255,0.07)" }}
                >
                  <View className="flex-row items-center gap-6">
                    <RenderIcon icon={it.icon} danger={it.danger} />
                    <Text
                      className={`text-xl font-semibold ${
                        it.danger ? "text-red-400" : "text-white"
                      }`}
                    >
                      {it.label}
                    </Text>
                  </View>
                  {it.right ?? (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="rgba(255,255,255,0.6)"
                    />
                  )}
                </Pressable>
              ))}
            </View>

            {/* Footer */}
            {footer ? (
              <>
                <View className="mt-auto h-[1px] bg-white/10 mx-4" />
                <View
                  className="px-4 py-3"
                  style={{ paddingBottom: Math.max(bottom, 10) }}
                >
                  {footer}
                </View>
              </>
            ) : null}
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

// ========================= Wrapper: SideMenu =========================
type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};
export function SideMenu({ open, onClose }: SideMenuProps) {
  return (
    <SmoothSideMenu
      visible={open}
      onClose={onClose}
      width={312}
      header={
        <View className="flex-col items-start gap-8 justify-between">
          <View className="flex-row items-center justify-between w-full">
            <SideLogo width={132} />
            <TouchableOpacity
              activeOpacity={0.85}
              className="flex-row items-center justify-between rounded-full p-2"
              style={{ backgroundColor: "#FFFFFF10" }}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="flex-col items-start gap-3">
            <Image
              source={{ uri: "https://avatar.iran.liara.run/public/boy" }} // ✅ not src(url)
              className="w-16 h-16 rounded-full bg-white/10"
              resizeMode="cover"
            />
            <View>
              <Text className="text-white font-semibold text-2xl">
                Praveen Kumar
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-white/50 text-sm">
                  praveenkumar75566@gmail.com
                </Text>
                <FontAwesome name="check-circle" size={14} color="#29BC00" />
              </View>
            </View>
          </View>
        </View>
      }
      items={[
        { key: "chat", label: "Chat", icon: <Chat width={28} height={28} /> }, // custom SVG icon
        {
          key: "upgrade",
          label: "Upgrade",
          icon: <Upgrade width={28} height={28} />,
          right: (
            <TouchableOpacity className="flex-row items-center gap-1.5 px-2.5 py-2 rounded-full bg-[#1630B260] active:opacity-80">
              {/* <Shine width={22} height={22} color="#B5C1FF" /> */}
              <Shine width={22} color="#B5C1FF" />
              <Text className="text-[#B5C1FF] text-base font-semibold">
                Get Plus
              </Text>
            </TouchableOpacity>
          ),
        },
        {
          key: "profile",
          label: "Profile",
          icon: <Profile width={28} height={28} />,
        },
        {
          key: "backup",
          label: "Backup",
          icon: <BackUp width={28} height={28} />,
        },
        {
          key: "settings",
          label: "Settings",
          icon: <Settins width={28} height={28} />,
        },
        {
          key: "about",
          label: "About",
          icon: <About width={28} height={28} />,
        },
      ]}
      footer={
        <Pressable
          className="flex-row items-center justify-between py-4"
          android_ripple={{ color: "rgba(255,255,255,0.07)" }}
        >
          <View className="flex-row items-center gap-6">
            <MaterialIcons name="logout" size={28} color="red" />
            <Text className="text-xl font-semibold text-red-500">Sign Out</Text>
          </View>
        </Pressable>
      }
    />
  );
}
