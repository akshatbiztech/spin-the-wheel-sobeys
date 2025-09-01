import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface QuickActionsProps {
  onSpinWheel: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSpinWheel }) => {
  const actions = [
    {
      id: "spin",
      title: "Spin Wheel",
      icon: "🎡",
      color: "bg-primary-500",
      onPress: onSpinWheel,
    },
    {
      id: "history",
      title: "History",
      icon: "📋",
      color: "bg-secondary-500",
      onPress: () => {},
    },
    {
      id: "rewards",
      title: "Rewards",
      icon: "🏆",
      color: "bg-yellow-500",
      onPress: () => {},
    },
    {
      id: "settings",
      title: "Settings",
      icon: "⚙️",
      color: "bg-gray-500",
      onPress: () => {},
    },
  ];

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-secondary-800 mb-4">
        Quick Actions
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            className={`${action.color} w-20 h-20 rounded-2xl items-center justify-center shadow-sm`}
          >
            <Text className="text-2xl mb-1">{action.icon}</Text>
            <Text className="text-white text-xs font-medium text-center">
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
