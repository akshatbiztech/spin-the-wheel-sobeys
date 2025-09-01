import React from "react";
import { View, Text } from "react-native";
import { Card } from "../../../../components";

interface PrizeDisplayProps {
  prize: string;
}

export const PrizeDisplay: React.FC<PrizeDisplayProps> = ({ prize }) => {
  const isWin = prize !== "Try Again";

  const getPrizeIcon = (prize: string) => {
    if (prize.includes("Coffee")) return "☕";
    if (prize.includes("Points")) return "⭐";
    return "🎁";
  };

  const getPrizeColor = (prize: string) => {
    if (prize === "Try Again") return "text-red-600";
    if (prize.includes("Coffee")) return "text-green-600";
    return "text-yellow-600";
  };

  return (
    <Card variant="elevated">
      <View className="items-center py-4">
        <Text className="text-4xl mb-2">{getPrizeIcon(prize)}</Text>
        <Text className={`text-2xl font-bold ${getPrizeColor(prize)} mb-2`}>
          {isWin ? "Congratulations!" : "Better luck next time!"}
        </Text>
        <Text className="text-lg text-secondary-700 text-center">
          You won:{" "}
          <Text className="font-semibold text-primary-600">{prize}</Text>
        </Text>
        {isWin && (
          <Text className="text-sm text-secondary-500 text-center mt-2">
            Your prize has been added to your account
          </Text>
        )}
      </View>
    </Card>
  );
};
