import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "../Card";

export interface ActionItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
}

interface ActionListProps {
  title?: string;
  actions: ActionItem[];
  className?: string;
}

export const ActionList: React.FC<ActionListProps> = ({
  title,
  actions,
  className = "",
}) => {
  return (
    <View className={`mb-6 ${className}`}>
      {title && (
        <Text className="text-lg font-semibold text-secondary-800 mb-4">
          {title}
        </Text>
      )}
      <Card variant="elevated">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            disabled={action.disabled}
            className={`flex-row items-center py-4 border-b border-secondary-100 last:border-b-0 ${
              action.disabled ? "opacity-50" : ""
            }`}
          >
            <Text className="text-xl mr-4">{action.icon}</Text>
            <Text className="flex-1 text-secondary-800 font-medium">
              {action.title}
            </Text>
            <Text className="text-secondary-400">›</Text>
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );
};
