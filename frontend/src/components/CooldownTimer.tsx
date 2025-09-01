import React from "react";
import { View, Text } from "react-native";
import { useCooldownRemaining } from "../store";

interface CooldownTimerProps {
  className?: string;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({
  className = "",
}) => {
  const cooldownRemaining = useCooldownRemaining();

  if (cooldownRemaining <= 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <View
      className={`bg-red-100 border border-red-300 rounded-lg p-3 ${className}`}
    >
      <Text className="text-red-800 text-center font-medium">
        ⏰ Cooldown: {formatTime(cooldownRemaining)}
      </Text>
      <Text className="text-red-600 text-center text-sm mt-1">
        Please wait before spinning again
      </Text>
    </View>
  );
};
