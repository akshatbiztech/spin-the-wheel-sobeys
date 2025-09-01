import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from "../../../../components";

export const RecentSpins: React.FC = () => {
  const recentSpins = [
    {
      id: "1",
      prize: "Free Coffee",
      date: "2 hours ago",
      result: "win",
    },
    {
      id: "2",
      prize: "Try Again",
      date: "1 day ago",
      result: "lose",
    },
    {
      id: "3",
      prize: "50 Points",
      date: "2 days ago",
      result: "win",
    },
    {
      id: "4",
      prize: "Free Coffee",
      date: "3 days ago",
      result: "win",
    },
  ];

  const getResultColor = (result: string) => {
    return result === "win" ? "text-green-600" : "text-red-600";
  };

  const getResultIcon = (result: string) => {
    return result === "win" ? "🎉" : "😔";
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-secondary-800 mb-4">
        Recent Spins
      </Text>
      <Card variant="elevated">
        <ScrollView showsVerticalScrollIndicator={false}>
          {recentSpins.map((spin) => (
            <View
              key={spin.id}
              className="flex-row justify-between items-center py-3 border-b border-secondary-100 last:border-b-0"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-lg mr-3">
                  {getResultIcon(spin.result)}
                </Text>
                <View className="flex-1">
                  <Text className="font-medium text-secondary-800">
                    {spin.prize}
                  </Text>
                  <Text className="text-sm text-secondary-500">
                    {spin.date}
                  </Text>
                </View>
              </View>
              <Text className={`font-semibold ${getResultColor(spin.result)}`}>
                {spin.result === "win" ? "Won" : "Lost"}
              </Text>
            </View>
          ))}
        </ScrollView>
      </Card>
    </View>
  );
};
