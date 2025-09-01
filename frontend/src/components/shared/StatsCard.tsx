import React from "react";
import { View, Text } from "react-native";
import { Card } from "../Card";

export interface StatItem {
  label: string;
  value: string | number;
  color?: string;
}

interface StatsCardProps {
  stats: StatItem[];
  variant?: "elevated" | "outlined";
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  stats,
  variant = "elevated",
  className = "",
}) => {
  return (
    <Card variant={variant} className={className}>
      <View className="flex-row justify-between items-center">
        {stats.map((stat, index) => (
          <View key={index} className={index > 0 ? "items-end" : ""}>
            <Text className="text-lg font-semibold text-secondary-800">
              {stat.label}
            </Text>
            <Text
              className={`text-2xl font-bold ${
                stat.color || "text-primary-600"
              }`}
            >
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
};
