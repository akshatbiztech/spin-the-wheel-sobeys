import React from "react";
import { View, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "./pages/auth";
import { AppLayout } from "./pages/app/layout";
import { LandingPage } from "./pages/landing/page";
import { useAuth } from "./hooks/useAuth";
import { LoadingSpinner } from "./components";

const Stack = createNativeStackNavigator();

export const Layout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading.isLoading) {
    return (
      <View className="flex-1 bg-gradient-to-br from-primary-50 to-secondary-100 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 300,
          }}
        >
          {user ? (
            // Authenticated user screens
            <Stack.Screen name="App" component={AppLayout} />
          ) : (
            // Landing page first, then auth
            <>
              <Stack.Screen name="Landing" component={LandingPage} />
              <Stack.Screen name="Auth" component={AuthScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
