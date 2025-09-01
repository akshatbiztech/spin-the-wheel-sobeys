import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User } from "firebase/auth";

interface HomeHeaderProps {
  user: User | null;
  onProfilePress: () => void;
  onSignOut: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  onProfilePress,
  onSignOut,
}) => {
  return (
    <View className="flex-row justify-between items-center px-6 py-4 bg-white shadow-sm">
      <View>
        <Text className="text-xl font-bold text-primary-800">
          Spin the Wheel
        </Text>
        <Text className="text-sm text-secondary-600">{user?.email}</Text>
      </View>

      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          onPress={onProfilePress}
          className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center"
        >
          <Text className="text-lg">👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSignOut}
          className="px-3 py-1 bg-red-100 rounded-lg"
        >
          <Text className="text-red-600 text-sm font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
