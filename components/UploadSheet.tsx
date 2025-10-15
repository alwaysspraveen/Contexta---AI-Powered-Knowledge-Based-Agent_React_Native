// components/SmoothUploadSheet.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import React, { useEffect, useState } from "react";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (p: { name: string; description: string }) => void;
  onPickFile?: () => void;
  defaultName?: string;
  defaultDescription?: string;
  maxDescription?: number;
};

const { height: H } = Dimensions.get("window");
const OPEN_HEIGHT = Math.min(H * 0.86, 720); // snap height

export default function SmoothUploadSheet({
  visible,
  onClose,
  onConfirm,
  onPickFile,
  defaultName = "",
  defaultDescription = "",
  maxDescription = 100,
}: Props) {
  const { bottom } = useSafeAreaInsets();

  const [name, setName] = useState(defaultName);
  const [desc, setDesc] = useState(defaultDescription);

  // 0 = fully open, 1 = fully closed (easier for interpolation)
  const progress = useSharedValue(1);

  // open / close with timing
  useEffect(() => {
    if (visible) {
      setName(defaultName);
      setDesc(defaultDescription);
      progress.value = withTiming(0, { duration: 260 });
    } else {
      progress.value = 1;
    }
  }, [visible]);

  const close = () => {
    progress.value = withTiming(1, { duration: 220 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  };

  // Pan gesture for drag-to-dismiss
  const drag = Gesture.Pan()
    .onChange((e) => {
      // convert vertical drag into progress offset
      const delta = e.changeY / OPEN_HEIGHT;
      progress.value = Math.min(1, Math.max(0, progress.value + delta));
    })
    .onEnd((e) => {
      // if dragged down enough or flung, close
      if (progress.value > 0.25 || e.velocityY > 700) {
        progress.value = withTiming(
          1,
          { duration: 200 },
          (f) => f && runOnJS(onClose)()
        );
      } else {
        progress.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  // Backdrop style
  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 1],
      [0.55, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Sheet style
  const sheetStyle = useAnimatedStyle(() => {
    // translate from bottom by progress * OPEN_HEIGHT
    const ty = interpolate(
      progress.value,
      [0, 1],
      [0, OPEN_HEIGHT],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateY: ty }] };
  });

  if (!visible) return null;

  const canConfirm = name.trim().length > 0 && desc.trim().length > 0;

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-bottom} // 👈 key line
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "black",
            },
            backdropStyle,
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={close} />
        </Animated.View>

        {/* Bottom sheet */}
        <GestureDetector gesture={drag}>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "black",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                overflow: "hidden",
              },
              sheetStyle,
            ]}
          >
            <SafeAreaView edges={["top", "left", "right", "bottom"]}>
              {/* Grabber */}
              <View className="items-center pt-3">
                <View className="w-24 h-1.5 rounded-full bg-white/40" />
              </View>

              {/* Header */}
              <View className="px-5 py-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-2xl font-semibold">
                    Upload
                  </Text>
                  <Text className="text-white/60 mt-1">
                    Add your document pdf, image, text
                  </Text>
                </View>
                <Pressable
                  className="w-9 h-9 rounded-full bg-white/10 items-center justify-center"
                  onPress={close}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                </Pressable>
              </View>

              {/* Picker */}
              <Pressable
                onPress={onPickFile}
                className="mx-5 mt-2 rounded-2xl bg-white/05 border border-white/10 h-36 items-center justify-center"
              >
                <View className="w-14 h-14 rounded-full bg-white/10 items-center justify-center mb-2">
                  <Ionicons name="add" size={20} color="#fff" />
                </View>
                <Text className="text-white font-medium">
                  Choose a file or image
                </Text>
                <Text className="text-white/40 text-xs mt-1">
                  20 MB max file size
                </Text>
              </Pressable>

              {/* Form */}
              <View className="px-5 mt-5">
                <Text className="text-white/80 font-medium mb-2">
                  File Name <Text className="text-red-400">*</Text>
                </Text>
                <View className="rounded-xl border border-white/15">
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Maths Notes"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    className="px-3.5 py-3 text-white text-base"
                  />
                </View>

                <Text className="text-white/80 font-medium mt-5 mb-2">
                  Description <Text className="text-red-400">*</Text>
                </Text>
                <View className="rounded-xl border border-white/15">
                  <TextInput
                    value={desc}
                    onChangeText={(t) =>
                      t.length <= (maxDescription ?? 100) &&
                      desc !== t &&
                      setDesc(t)
                    }
                    multiline
                    placeholder="Add a short description…"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    className="px-3.5 py-3 text-white text-base min-h-[112px]"
                  />
                </View>
                <Text className="text-white/40 text-xs mt-1">
                  {desc.length}/{maxDescription}
                </Text>
              </View>

              {/* Footer */}
              <View
                className="flex-row gap-3 px-5 mt-5"
                style={{ paddingBottom: Math.max(bottom, 12) }}
              >
                <Pressable
                  onPress={close}
                  className="flex-1 h-12 rounded-xl bg-white/10 items-center justify-center"
                >
                  <Text className="text-white font-semibold">Cancel</Text>
                </Pressable>
                <Pressable
                  disabled={!canConfirm}
                  onPress={() =>
                    canConfirm &&
                    onConfirm({ name: name.trim(), description: desc.trim() })
                  }
                  className={`flex-1 h-12 rounded-xl items-center justify-center ${
                    canConfirm ? "bg-white" : "bg-white/30"
                  }`}
                >
                  <Text
                    className={`${
                      canConfirm ? "text-black" : "text-black/50"
                    } font-semibold`}
                  >
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Modal>
  );
}
