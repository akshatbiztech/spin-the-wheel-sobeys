import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, Dimensions, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  G,
  Path,
  Circle,
  Text as SvgText,
  Polygon,
} from "react-native-svg";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { firebaseConfig } from "../../config/firebase";

// ---- Firebase bootstrap (works with emulator or production) ----
function useFirebase() {
  const app = useMemo(
    () => (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)),
    []
  );
  const db = useMemo(() => getFirestore(app), [app]);
  const functions = useMemo(() => getFunctions(app), [app]);

  useEffect(() => {
    // Attach to emulators automatically in dev
    if (__DEV__) {
      try {
        connectFirestoreEmulator(db, "localhost", 8080);
      } catch {}
      try {
        connectFunctionsEmulator(functions, "localhost", 5001);
      } catch {}
    }
  }, [db, functions]);

  return { db, functions };
}

// ---- Types ----
export type WheelSegment = {
  label: string;
  weight: number;
  color: string;
};

export type WheelConfig = {
  cooldownSec: number;
  segments: WheelSegment[];
};

// ---- Geometry helpers for SVG wheel ----
const toRad = (deg: number) => (deg * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, angle: number) => ({
  x: cx + r * Math.cos(toRad(angle)),
  y: cy + r * Math.sin(toRad(angle)),
});

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

// Rotate the wheel so that index 0 sits at the top (pointer).
// We draw starting from -90º (top) and move clockwise.

const { width } = Dimensions.get("window");
const CARD_W = Math.min(width - 32, 380);
const WHEEL_SIZE = CARD_W * 0.63; // Increased by 15% from 0.55 to 0.63
const R = WHEEL_SIZE / 2;

interface SpinWheelProps {
  onSpinComplete?: (result: { index: number; label: string }) => void;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete }) => {
  const { db, functions } = useFirebase();
  const [cfg, setCfg] = useState<WheelConfig | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ index: number; label: string } | null>(
    null
  );
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const [rotation, setRotation] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Load spin sound
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../../assets/spin.mp3")
        );
        setSound(sound);
      } catch (error) {
        console.error("Error loading spin sound:", error);
      }
    };
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Fetch config from Firestore (wheelConfig/default)
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "wheelConfig/default"));
        if (snap.exists()) {
          const data = snap.data() as any;
          setCfg({ cooldownSec: data.cooldownSec, segments: data.segments });
        } else {
          // Fallback config if not seeded yet
          setCfg({
            cooldownSec: 30,
            segments: [
              { label: "Try Again", weight: 25, color: "#fdba74" }, // index 0 - top
              { label: "50 Points", weight: 5, color: "#fde047" }, // index 1 - top-right
              { label: "Free Item", weight: 2, color: "#86efac" }, // index 2 - right
              { label: "20 Points", weight: 8, color: "#93c5fd" }, // index 3 - bottom-right
              { label: "Coupon", weight: 5, color: "#c4b5fd" }, // index 4 - bottom
              { label: "5 Points", weight: 20, color: "#f9a8d4" }, // index 5 - bottom-left
              { label: "Mystery", weight: 5, color: "#a7f3d0" }, // index 6 - left
              { label: "10 Points", weight: 10, color: "#fca5a5" }, // index 7 - top-left
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching wheel config:", error);
        // Fallback config
        setCfg({
          cooldownSec: 30,
          segments: [
            { label: "Try Again", weight: 25, color: "#fdba74" }, // index 0 - top
            { label: "50 Points", weight: 5, color: "#fde047" }, // index 1 - top-right
            { label: "Free Item", weight: 2, color: "#86efac" }, // index 2 - right
            { label: "20 Points", weight: 8, color: "#93c5fd" }, // index 3 - bottom-right
            { label: "Coupon", weight: 5, color: "#c4b5fd" }, // index 4 - bottom
            { label: "5 Points", weight: 20, color: "#f9a8d4" }, // index 5 - bottom-left
            { label: "Mystery", weight: 5, color: "#a7f3d0" }, // index 6 - left
            { label: "10 Points", weight: 10, color: "#fca5a5" }, // index 7 - top-left
          ],
        });
      }
    })();
  }, [db]);

  // Cooldown stored locally (swap to Firestore per-user if you have auth)
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const ts = await AsyncStorage.getItem("lastSpinTs");
        const last = ts ? parseInt(ts, 10) : 0;
        const cd = Math.max(
          0,
          (cfg?.cooldownSec ?? 0) - Math.floor((Date.now() - last) / 1000)
        );
        setCooldownLeft(cd);
      } catch (error) {
        console.error("Error checking cooldown:", error);
      }
    }, 300);
    return () => clearInterval(t);
  }, [cfg?.cooldownSec]);

  const segmentAngle = useMemo(
    () => (cfg ? 360 / cfg.segments.length : 0),
    [cfg]
  );

  // Local weighted random as a fallback if the Cloud Function is unreachable
  const localWeightedIndex = useCallback(() => {
    if (!cfg) return 0;
    const total = cfg.segments.reduce((s, x) => s + (x.weight || 1), 0);
    let r = Math.random() * total;
    for (let i = 0; i < cfg.segments.length; i++) {
      r -= cfg.segments[i].weight || 1;
      if (r <= 0) return i;
    }
    return cfg.segments.length - 1;
  }, [cfg]);

  const onSpin = useCallback(async () => {
    if (!cfg || busy || cooldownLeft > 0) return;
    setBusy(true);
    Haptics.selectionAsync();

    // Play spin sound
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.error("Error playing spin sound:", error);
      }
    }

    try {
      const clientRequestId = `spin_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const callable = httpsCallable<
        { clientRequestId: string },
        { winningIndex: number; prizeLabel: string }
      >(functions, "spinWheel");
      const resp = await callable({ clientRequestId });
      const index = (resp.data as any)?.winningIndex ?? localWeightedIndex();
      await AsyncStorage.setItem("lastSpinTs", String(Date.now()));

      // Simple rotation animation
      const newRotation = rotation + 1440 + index * segmentAngle; // 4 full spins + segment position
      // Ensure rotation is a valid number
      if (isNaN(newRotation) || !isFinite(newRotation)) {
        console.warn(
          "Invalid rotation value:",
          newRotation,
          "falling back to 0"
        );
        setRotation(0);
      } else {
        setRotation(newRotation);
      }

      // Show result after exactly 3 seconds and 10 milliseconds
      setTimeout(() => {
        const result = { index: index, label: cfg.segments[index].label };
        setResult(result);
        setBusy(false);
        onSpinComplete?.(result);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 3010); // 3 seconds + 10 milliseconds
    } catch (e) {
      console.error("Error calling spinWheel function:", e);
      // Fallback to local weighted pick
      const index = localWeightedIndex();
      await AsyncStorage.setItem("lastSpinTs", String(Date.now()));

      // Simple rotation animation
      const newRotation = rotation + 1440 + index * segmentAngle; // 4 full spins + segment position
      // Ensure rotation is a valid number
      if (isNaN(newRotation) || !isFinite(newRotation)) {
        console.warn(
          "Invalid rotation value:",
          newRotation,
          "falling back to 0"
        );
        setRotation(0);
      } else {
        setRotation(newRotation);
      }

      // Show result after exactly 3 seconds and 10 milliseconds
      setTimeout(() => {
        const result = { index, label: cfg.segments[index].label };
        setResult(result);
        setBusy(false);
        onSpinComplete?.(result);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 3010); // 3 seconds + 10 milliseconds
    }
  }, [
    cfg,
    functions,
    busy,
    cooldownLeft,
    localWeightedIndex,
    rotation,
    segmentAngle,
    onSpinComplete,
    sound,
  ]);

  if (!cfg)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <LinearGradient
        colors={["#7c3aed", "#7c3aed"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: CARD_W, borderRadius: 28 }}
      >
        <View style={{ padding: 20 }}>
          <View style={{ alignItems: "center" }}>
            {/* Stopper */}
            <Svg width={42} height={32} style={{ zIndex: 2 }}>
              <Polygon
                points="21,30 40,2 2,2"
                fill="#f5d142"
                stroke="#b78a00"
                strokeWidth={2}
              />
            </Svg>
            {/* Wheel */}
            <View
              style={{
                width: WHEEL_SIZE,
                height: WHEEL_SIZE,
                marginTop: -10,
              }}
            >
              <Svg
                width={WHEEL_SIZE}
                height={WHEEL_SIZE}
                viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
              >
                <G x={0} y={0}>
                  <Circle cx={R} cy={R} r={R} fill="#1d4ed8" />
                </G>
                <G transform={`rotate(${rotation}, ${R}, ${R})`}>
                  {cfg.segments.map((seg, i) => {
                    const start = -90 + i * segmentAngle;
                    const end = start + segmentAngle;
                    const d = arcPath(R, R, R - 8, start, end);
                    const mid = start + segmentAngle / 2;
                    const labelPos = polar(R, R, R * 0.63, mid);
                    return (
                      <G key={i}>
                        <Path
                          d={d}
                          fill={seg.color}
                          stroke="#f1f5f9"
                          strokeWidth={2}
                        />
                        <SvgText
                          x={labelPos.x}
                          y={labelPos.y}
                          fontSize={14}
                          fontWeight="700"
                          fill="#0f172a"
                          textAnchor="middle"
                          transform={`rotate(${mid + 90}, ${labelPos.x}, ${
                            labelPos.y
                          })}`}
                        >
                          {seg.label}
                        </SvgText>
                      </G>
                    );
                  })}
                  <Circle cx={R} cy={R} r={14} fill="#0f172a" />
                </G>
              </Svg>
            </View>
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            Spin The Fortune Wheel
          </Text>
          <Pressable
            onPress={onSpin}
            disabled={busy || cooldownLeft > 0}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
              borderRadius: 16,
              height: 58,
              backgroundColor: busy || cooldownLeft > 0 ? "#9ca3af" : "white",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: busy || cooldownLeft > 0 ? "#6b7280" : "#7c3aed",
              }}
            >
              {cooldownLeft > 0
                ? `Wait ${cooldownLeft}s`
                : busy
                ? "Spinning…"
                : "Play"}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Result modal */}
      <Modal
        visible={!!result}
        transparent
        animationType="fade"
        onRequestClose={() => setResult(null)}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderRadius: 16,
              width: "80%",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
              🎉 Congratulations!
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>
              You won:{" "}
              <Text style={{ fontWeight: "600" }}>{result?.label}</Text>
            </Text>
            <Pressable
              onPress={() => setResult(null)}
              style={{
                backgroundColor: "#4f46e5",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
