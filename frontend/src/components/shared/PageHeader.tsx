import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  rightAction,
  className = "",
}) => {
  return (
    <View
      className={`flex-row justify-between items-center px-6 py-4 bg-white shadow-sm ${className}`}
    >
      {onBack ? (
        <TouchableOpacity onPress={onBack}>
          <Text className="text-lg">← Back</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-8" />
      )}

      <Text className="text-xl font-bold text-primary-800">{title}</Text>

      {rightAction ? (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Text className="text-lg">{rightAction.icon}</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-8" />
      )}
    </View>
  );
};
