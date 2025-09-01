import React from "react";
import { View, Text } from "react-native";
import { StatsCard, StatItem } from "../../../../components/shared";

export const ProfileStats: React.FC = () => {
  const stats: StatItem[] = [
    {
      label: "Total Spins",
      value: "156",
      color: "text-primary-600",
    },
    {
      label: "Total Wins",
      value: "89",
      color: "text-green-600",
    },
    {
      label: "Win Rate",
      value: "57%",
      color: "text-blue-600",
    },
    {
      label: "Total Points",
      value: "12,450",
      color: "text-yellow-600",
    },
    {
      label: "Coffees Won",
      value: "23",
      color: "text-brown-600",
    },
    {
      label: "Current Streak",
      value: "5 days",
      color: "text-orange-600",
    },
  ];

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-secondary-800 mb-4">
        Your Statistics
      </Text>
      <StatsCard stats={stats} />
    </View>
  );
};
