import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LoadingSpinner } from "../../components";
import { useAuth } from "../../hooks/useAuth";

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, loading } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  };

  if (loading.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="lg" text="Authenticating..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Landing" as never)}
        style={styles.backIconButton}
        activeOpacity={0.8}
      >
        <Text style={styles.backIconText}>←</Text>
      </TouchableOpacity>

      <View style={styles.mainContent}>
        {/* Header with Icon */}
        <View style={styles.headerContainer}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>🎯</Text>
          </View>
          <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Id</Text>
            <View style={styles.inputField}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="david@gmail.com"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputField}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#6b7280"
                secureTextEntry
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Login/Register Button */}
          <TouchableOpacity
            onPress={handleAuth}
            style={styles.authButton}
            activeOpacity={0.8}
          >
            <Text style={styles.authButtonText}>
              {isLogin ? "Login" : "Register"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* OR Divider */}
        <View style={styles.orContainer}>
          <Text style={styles.orText}>OR</Text>
        </View>

        {/* Toggle Auth Mode */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin ? "Not have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleLink}>
              {isLogin ? "Register here" : "Login here"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  iconText: {
    fontSize: 48,
    color: "#ffffff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  authButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 16,
  },
  authButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
  orContainer: {
    marginVertical: 24,
    alignItems: "center",
  },
  orText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    fontSize: 16,
    color: "#6b7280",
  },
  toggleLink: {
    fontSize: 16,
    color: "#a855f7",
    fontWeight: "600",
  },
  backIconButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7c3aed",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  backIconText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
