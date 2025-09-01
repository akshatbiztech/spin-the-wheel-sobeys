import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export const LandingPage: React.FC = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Navigate to auth screen
    navigation.navigate("Auth" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>🎯</Text>
          </View>
        </View>

        {/* Heading */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingLine1}>SPIN THE</Text>
          <View style={styles.gradientTextContainer}>
            <Text style={[styles.headingLine2, { color: "#ffffff" }]}>W</Text>
            <Text style={[styles.headingLine2, { color: "#e9d5ff" }]}>H</Text>
            <Text style={[styles.headingLine2, { color: "#d8b4fe" }]}>E</Text>
            <Text style={[styles.headingLine2, { color: "#c084fc" }]}>E</Text>
            <Text style={[styles.headingLine2, { color: "#a855f7" }]}>L</Text>
            <Text style={[styles.headingLine2, { color: "#9333ea" }]}>.</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          style={styles.button}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Continue</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  icon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 80,
    color: "#ffffff",
  },
  headingContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  gradientTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headingLine1: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  headingLine2: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 8,
  },
  buttonArrow: {
    color: "#ffffff",
    fontSize: 20,
  },
});
