import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageHeader } from "./PageHeader";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  title: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = "",
  contentClassName = "",
  title,
  onBack,
  rightAction,
}) => {
  return (
    <SafeAreaView
      className={`flex-1 bg-gradient-to-br from-primary-50 to-secondary-100 ${className}`}
    >
      <PageHeader title={title} onBack={onBack} rightAction={rightAction} />
      <View className={`flex-1 px-6 py-6 ${contentClassName}`}>{children}</View>
    </SafeAreaView>
  );
};
