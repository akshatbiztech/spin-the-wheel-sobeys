import React from "react";
import { View, Text } from "react-native";
import { StatsCard, StatItem } from "../../../../components/shared";

export const StatsOverview: React.FC = () => {
  const stats: StatItem[] = [
    {
      label: "Total Spins",
      value: "24",
      color: "text-primary-600",
    },
    {
      label: "Wins",
      value: "8",
      color: "text-green-600",
    },
    {
      label: "Win Rate",
      value: "33%",
      color: "text-blue-600",
    },
    {
      label: "Points",
      value: "1,250",
      color: "text-yellow-600",
    },
  ];

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-secondary-800 mb-4">
        Your Stats
      </Text>
      <StatsCard stats={stats} />
    </View>
  );
};
