import React from "react";
import { View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  SpinWheel,
  StatsCard,
  StatItem,
  PageLayout,
} from "../../../components";
import { PrizeDisplay } from "./components/PrizeDisplay";
import { SpinHistory } from "./components/SpinHistory";
import { useWheel } from "../../../hooks/useWheel";

export const SpinWheelScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    isSpinning,
    currentSpinResult,
    spinHistory,
    canSpin,
    formattedCooldown,
    loadingStates,
    spinWheel,
    clearSpinResult,
  } = useWheel();

  const handleSpin = async () => {
    if (!canSpin || isSpinning) {
      if (formattedCooldown) {
        Alert.alert(
          "Cooldown Active",
          `Please wait ${formattedCooldown} before spinning again.`
        );
      }
      return;
    }

    try {
      await spinWheel();
    } catch (error) {
      Alert.alert("Error", "Failed to spin the wheel. Please try again.");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const stats: StatItem[] = [
    {
      label: "Total Spins",
      value: spinHistory.length,
      color: "text-primary-600",
    },
    {
      label: "Can Spin",
      value: canSpin ? "Yes" : "No",
      color: canSpin ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <PageLayout title="Spin the Wheel" onBack={handleBack}>
      {/* Spin Wheel */}
      <View className="items-center mb-6">
        <SpinWheel
          onSpinComplete={(result) => {
            // This will be handled by the server response
            console.log("Spin completed:", result);
          }}
        />
      </View>

      {/* Prize Display */}
      {currentSpinResult && (
        <View className="mb-6">
          <PrizeDisplay prize={currentSpinResult.itemName} />
        </View>
      )}

      {/* Stats */}
      <StatsCard stats={stats} className="mb-6" />

      {/* Spin History */}
      <SpinHistory />
    </PageLayout>
  );
};
