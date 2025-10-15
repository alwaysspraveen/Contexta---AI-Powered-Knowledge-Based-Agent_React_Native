// components/CyclingWordMoti.tsx
import { AnimatePresence, MotiText } from "moti";
import React from "react";
import { Text, TextStyle, View } from "react-native";

type Word = { text: string; color: string };

export default function CyclingWordMoti({
  words = [
    { text: "notes", color: "#60A5FA" },
    { text: "files", color: "#FF4D20" },
    { text: "image", color: "#22C55E" },
    { text: "docs", color: "#F59E0B" },
  ],
  prefix = "Bring your ",
  suffix = "I’ll build the brain",
  interval = 1600, // total time per word
  fontSize = 36, // text-3xl
  lineHeight = 36, // leading-9
  fontWeight: fw = "700", // font-bold
  staticColor = "#FFFFFF", // color for prefix/suffix
}: {
  words?: Word[];
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  interval?: number;
  fontSize?: number;
  lineHeight?: number;
  fontWeight?: TextStyle["fontWeight"];
  staticColor?: string;
}) {
  // stable width so layout doesn’t shift
  const minWidth = React.useMemo(() => {
    const longest = words.reduce((m, w) => Math.max(m, w.text.length), 0);
    return Math.ceil(longest * fontSize * 0.62) + 12;
  }, [words, fontSize]);

  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [interval, words.length]);

  // Shared text style for static parts
  const base = { fontSize, lineHeight, fontWeight: fw } as const;

  return (
    <View className="flex-col">
      <View className="flex-row ">
        {/* left (static) */}
        {typeof prefix === "string" ? (
          <Text style={[base, { color: staticColor }]}>{prefix}</Text>
        ) : (
          prefix
        )}

        {/* middle (animated word) */}
        <View
          pointerEvents="none"
          style={{
            height: lineHeight,
            minWidth,
            overflow: "hidden",
            justifyContent: "center",
            marginRight: 4,
          }}
        >
          <AnimatePresence>
            <MotiText
              key={i}
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -8 }}
              transition={{ type: "timing", duration: 240 }}
              style={{
                position: "absolute",
                fontSize,
                lineHeight,
                fontWeight: fw,
                color: words[i].color,
              }}
            >
              {words[i].text},
            </MotiText>
          </AnimatePresence>
        </View>
      </View>
      <Text style={[base, { color: staticColor }]}>{suffix}</Text>
    </View>
  );
}
