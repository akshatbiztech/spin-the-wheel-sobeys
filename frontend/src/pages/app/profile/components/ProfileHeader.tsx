import React from "react";
import { View, Text } from "react-native";
import { User } from "firebase/auth";
import { Card } from "../../../../components";

interface ProfileHeaderProps {
  user: User | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <Card variant="elevated" className="mb-6">
      <View className="items-center py-6">
        <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
          <Text className="text-4xl">👤</Text>
        </View>
        <Text className="text-2xl font-bold text-secondary-800 mb-2">
          {user?.displayName || "User"}
        </Text>
        <Text className="text-secondary-600 mb-4">{user?.email}</Text>
        <View className="bg-primary-100 px-4 py-2 rounded-full">
          <Text className="text-primary-700 font-medium">Premium Member</Text>
        </View>
      </View>
    </Card>
  );
};
