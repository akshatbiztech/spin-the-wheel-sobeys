import { useCallback, useEffect, useRef } from "react";
import { useWheelStore } from "../store";
import { wheelService } from "../services/wheelService";
import { SpinResult } from "../types";

export const useWheel = (userId?: string) => {
  const {
    // State
    isSpinning,
    currentSpinResult,
    spinHistory,
    nextAllowedSpinAt,
    cooldownRemaining,
    loadingStates,

    // Actions
    startSpin,
    completeSpin,
    setSpinResult,
    setSpinHistory,
    setNextAllowedSpinAt,
    updateCooldownRemaining,
    setLoadingState,
    canSpin,
  } = useWheelStore();

  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update cooldown timer
  useEffect(() => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    if (nextAllowedSpinAt && nextAllowedSpinAt > Date.now()) {
      cooldownIntervalRef.current = setInterval(() => {
        const remaining = wheelService.getCooldownRemaining(nextAllowedSpinAt);
        updateCooldownRemaining(remaining);

        if (remaining <= 0) {
          if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
        }
      }, 1000);
    }

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [nextAllowedSpinAt, updateCooldownRemaining]);

  // Load spin history on mount
  useEffect(() => {
    loadSpinHistory();
  }, [userId]);

  /**
   * Spin the wheel with server-authoritative result
   */
  const spinWheel = useCallback(async () => {
    if (!canSpin() || isSpinning) {
      return;
    }

    try {
      setLoadingState("spin", { isLoading: true });
      startSpin();

      // Call Firebase Cloud Function
      const response = await wheelService.spinWheel(userId);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to spin wheel");
      }

      // Convert response to SpinResult
      const spinResult = wheelService.convertToSpinResult(
        response.data,
        userId
      );

      if (spinResult) {
        // Update store with server result
        completeSpin(spinResult);
        setNextAllowedSpinAt(response.data.nextAllowedAt);
        updateCooldownRemaining(response.data.cooldownSeconds);
      }

      setLoadingState("spin", { isLoading: false });

      return spinResult;
    } catch (error) {
      setLoadingState("spin", {
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }, [
    canSpin,
    isSpinning,
    userId,
    startSpin,
    completeSpin,
    setNextAllowedSpinAt,
    updateCooldownRemaining,
    setLoadingState,
  ]);

  /**
   * Load user's spin history
   */
  const loadSpinHistory = useCallback(
    async (limit: number = 20) => {
      try {
        setLoadingState("history", { isLoading: true });

        const response = await wheelService.getSpinHistory(userId, limit);

        if (response.success && response.data) {
          setSpinHistory(response.data as unknown as SpinResult[]);
        }

        setLoadingState("history", { isLoading: false });
      } catch (error) {
        setLoadingState("history", {
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Failed to load history",
        });
      }
    },
    [userId, setSpinHistory, setLoadingState]
  );

  /**
   * Refresh spin history
   */
  const refreshHistory = useCallback(() => {
    loadSpinHistory();
  }, [loadSpinHistory]);

  /**
   * Clear current spin result
   */
  const clearSpinResult = useCallback(() => {
    setSpinResult(null);
  }, [setSpinResult]);

  /**
   * Get formatted cooldown time
   */
  const getFormattedCooldown = useCallback(() => {
    if (cooldownRemaining <= 0) return null;

    const minutes = Math.floor(cooldownRemaining / 60);
    const seconds = cooldownRemaining % 60;

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  }, [cooldownRemaining]);

  return {
    // State
    isSpinning,
    currentSpinResult,
    spinHistory,
    canSpin: canSpin(),
    cooldownRemaining,
    formattedCooldown: getFormattedCooldown(),
    loadingStates,

    // Actions
    spinWheel,
    loadSpinHistory,
    refreshHistory,
    clearSpinResult,
  };
};
