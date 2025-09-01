import React from "react";
import { View, Text } from "react-native";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  color?: "primary" | "secondary" | "white";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  color = "primary",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-primary-500 border-t-transparent",
    secondary: "border-secondary-500 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <View className="items-center">
      <View
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin mb-3`}
      />
      {text && (
        <Text className="text-secondary-600 font-medium text-center">
          {text}
        </Text>
      )}
    </View>
  );
};
