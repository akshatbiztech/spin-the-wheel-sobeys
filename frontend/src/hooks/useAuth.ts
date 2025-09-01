import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { AuthService } from "../services/auth";
import { LoadingState } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true });

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading({ isLoading: true });
    try {
      const result = await AuthService.signIn(email, password);
      setUser(result.user);
      setLoading({ isLoading: false });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Sign up
  const signUp = useCallback(async (email: string, password: string) => {
    setLoading({ isLoading: true });
    try {
      const result = await AuthService.signUp(email, password);
      setUser(result.user);
      setLoading({ isLoading: false });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading({ isLoading: true });
    try {
      await AuthService.signOut();
      setUser(null);
      setLoading({ isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setLoading({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setLoading((prev) => ({ ...prev, error: undefined }));
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return AuthService.isAuthenticated();
  }, []);

  // Get current user
  const getCurrentUser = useCallback(() => {
    return AuthService.getCurrentUser();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setLoading({ isLoading: false });
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    clearError,
    isAuthenticated,
    getCurrentUser,
  };
}
