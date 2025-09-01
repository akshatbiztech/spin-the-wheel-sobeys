import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../hooks/useAuth";
import { SettingsIcon, LogoutIcon } from "../../../components";
import { wheelService, SpinHistoryItem } from "../../../services/wheelService";

export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  const [spinHistory, setSpinHistory] = useState<SpinHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSpinHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await wheelService.getSpinHistory(user?.uid, 50, 0);

      if (response.success && response.data) {
        setSpinHistory(response.data);
      } else {
        setError(response.error || "Failed to load history");
      }
    } catch (err) {
      console.error("Error loading spin history:", err);
      setError("Failed to load spin history");
    } finally {
      setIsLoading(false);
    }
  };

  // Load history when component mounts
  useEffect(() => {
    loadSpinHistory();
  }, []);

  // Refresh history when screen comes into focus (after new spin)
  useFocusEffect(
    React.useCallback(() => {
      loadSpinHistory();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleSettings = () => {
    // TODO: Navigate to settings
    console.log("Settings pressed");
  };

  const formatDate = (timestamp: string) => {
    const now = new Date();
    const spinDate = new Date(timestamp);
    const diffInHours = (now.getTime() - spinDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInHours * 60);
        return `${diffInMinutes} minutes ago`;
      }
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return spinDate.toLocaleDateString();
    }
  };

  const totalSpins = spinHistory.length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
            <LogoutIcon color="#ffffff" size={20} />
          </TouchableOpacity>
          <View style={styles.headerCenter} />
          <TouchableOpacity
            onPress={handleSettings}
            style={styles.headerButton}
          >
            <SettingsIcon color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header with Logout and Settings */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <LogoutIcon color="#ffffff" size={20} />
        </TouchableOpacity>

        <View style={styles.headerCenter} />

        <TouchableOpacity onPress={handleSettings} style={styles.headerButton}>
          <SettingsIcon color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={loadSpinHistory}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalSpins}</Text>
              <Text style={styles.statLabel}>Total Spins</Text>
            </View>
          </View>
        </View>

        {/* Recent Spins Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Spins</Text>
          {spinHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No spins yet</Text>
              <Text style={styles.emptySubtext}>
                Your spin history will appear here
              </Text>
            </View>
          ) : (
            <View style={styles.spinList}>
              {spinHistory.map((spin, index) => (
                <View key={spin.spinId || index} style={styles.spinItem}>
                  <Text style={styles.spinDate}>
                    {formatDate(spin.createdAt)}
                  </Text>
                  <Text style={styles.spinResult}>Won {spin.prizeLabel}</Text>
                </View>
              ))}
            </View>
          )}
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  errorContainer: {
    backgroundColor: "#fef3f2",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  errorText: {
    color: "#991b1b",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7c3aed",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "600",
  },
  spinList: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  spinItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  spinDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  spinResult: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
