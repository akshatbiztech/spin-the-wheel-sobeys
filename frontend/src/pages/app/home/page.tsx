import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { SettingsIcon, LogoutIcon } from "../../../components";
import { SpinWheel } from "../../../components/SpinWheel";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const [latestReward, setLatestReward] = useState<string>("You won 50 coins!");

  const handleSpinComplete = (result: { index: number; label: string }) => {
    console.log("Spin completed:", result);
    // Update the latest reward with the new result
    setLatestReward(`You won ${result.label}!`);
  };

  const handleSettings = () => {
    // TODO: Navigate to settings
    console.log("Settings pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with Logout and Settings */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={signOut}
          style={styles.headerButton}
          activeOpacity={0.8}
        >
          <LogoutIcon color="#ffffff" size={20} />
        </TouchableOpacity>

        <View style={styles.headerCenter} />

        <TouchableOpacity
          onPress={handleSettings}
          style={styles.headerButton}
          activeOpacity={0.8}
        >
          <SettingsIcon color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Latest Reward Section */}
        <View style={styles.rewardContainer}>
          <View style={styles.rewardCard}>
            <View style={styles.rewardContent}>
              <Text style={styles.rewardIcon}>🎁</Text>
              <View style={styles.rewardText}>
                <Text style={styles.rewardTitle}>Latest Reward</Text>
                <Text style={styles.rewardSubtitle}>{latestReward}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spin The Fortune Wheel Section */}
        <View style={styles.wheelContainer}>
          <SpinWheel onSpinComplete={handleSpinComplete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rewardContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  rewardCard: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 20,
  },
  rewardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  rewardText: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  rewardSubtitle: {
    fontSize: 14,
    color: "#e9d5ff",
  },
  wheelContainer: {
    marginBottom: 24,
  },
});
