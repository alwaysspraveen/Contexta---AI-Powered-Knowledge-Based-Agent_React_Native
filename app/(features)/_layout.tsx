import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
export default function FeaturesLayout() {
  return (
    <SafeAreaView
      className="flex-1 bg-[#111111]"
      edges={["top", "left", "right", "bottom"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // 👈 hides entire tab bar
        }}
      >
        <Tabs.Screen name="newChat" />
        <Tabs.Screen name="quickChat" />
      </Tabs>
    </SafeAreaView>
  );
}
