import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { SpinWheelItem, SpinResult, LoadingState } from "../types";

// Types for the store
export interface WheelState {
  // Wheel configuration
  wheelConfig: SpinWheelItem[];
  isWheelConfigLoading: boolean;

  // Current spin state
  isSpinning: boolean;
  currentSpinResult: SpinResult | null;
  lastSpinTimestamp: number | null;

  // Spin history
  spinHistory: SpinResult[];
  isHistoryLoading: boolean;

  // Cooldown management
  nextAllowedSpinAt: number | null;
  cooldownRemaining: number; // in seconds

  // User preferences
  soundEnabled: boolean;
  hapticEnabled: boolean;

  // Loading states
  loadingStates: {
    spin: LoadingState;
    history: LoadingState;
    config: LoadingState;
  };
}

export interface WheelActions {
  // Wheel configuration
  setWheelConfig: (config: SpinWheelItem[]) => void;
  setWheelConfigLoading: (loading: boolean) => void;

  // Spin actions
  startSpin: () => void;
  completeSpin: (result: SpinResult) => void;
  setSpinResult: (result: SpinResult | null) => void;

  // History management
  addSpinToHistory: (spin: SpinResult) => void;
  setSpinHistory: (history: SpinResult[]) => void;
  setHistoryLoading: (loading: boolean) => void;

  // Cooldown management
  setNextAllowedSpinAt: (timestamp: number | null) => void;
  updateCooldownRemaining: (seconds: number) => void;

  // User preferences
  toggleSound: () => void;
  toggleHaptic: () => void;

  // Loading state management
  setLoadingState: (
    key: keyof WheelState["loadingStates"],
    state: LoadingState
  ) => void;

  // Utility actions
  resetSpinState: () => void;
  canSpin: () => boolean;
}

export type WheelStore = WheelState & WheelActions;

// Initial state
const initialState: WheelState = {
  wheelConfig: [],
  isWheelConfigLoading: false,
  isSpinning: false,
  currentSpinResult: null,
  lastSpinTimestamp: null,
  spinHistory: [],
  isHistoryLoading: false,
  nextAllowedSpinAt: null,
  cooldownRemaining: 0,
  soundEnabled: true,
  hapticEnabled: true,
  loadingStates: {
    spin: { isLoading: false },
    history: { isLoading: false },
    config: { isLoading: false },
  },
};

// Create the store
export const useWheelStore = create<WheelStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Wheel configuration actions
        setWheelConfig: (config) => set({ wheelConfig: config }),
        setWheelConfigLoading: (loading) =>
          set({ isWheelConfigLoading: loading }),

        // Spin actions
        startSpin: () => set({ isSpinning: true }),
        completeSpin: (result) =>
          set((state) => ({
            isSpinning: false,
            currentSpinResult: result,
            lastSpinTimestamp: Date.now(),
            spinHistory: [result, ...state.spinHistory],
          })),
        setSpinResult: (result) => set({ currentSpinResult: result }),

        // History management
        addSpinToHistory: (spin) =>
          set((state) => ({
            spinHistory: [spin, ...state.spinHistory],
          })),
        setSpinHistory: (history) => set({ spinHistory: history }),
        setHistoryLoading: (loading) => set({ isHistoryLoading: loading }),

        // Cooldown management
        setNextAllowedSpinAt: (timestamp) =>
          set({ nextAllowedSpinAt: timestamp }),
        updateCooldownRemaining: (seconds) =>
          set({ cooldownRemaining: seconds }),

        // User preferences
        toggleSound: () =>
          set((state) => ({ soundEnabled: !state.soundEnabled })),
        toggleHaptic: () =>
          set((state) => ({ hapticEnabled: !state.hapticEnabled })),

        // Loading state management
        setLoadingState: (key, state) =>
          set((prev) => ({
            loadingStates: { ...prev.loadingStates, [key]: state },
          })),

        // Utility actions
        resetSpinState: () =>
          set({
            isSpinning: false,
            currentSpinResult: null,
          }),

        canSpin: () => {
          const { isSpinning, nextAllowedSpinAt } = get();
          if (isSpinning) return false;
          if (!nextAllowedSpinAt) return true;
          return Date.now() >= nextAllowedSpinAt;
        },
      }),
      {
        name: "wheel-store",
        partialize: (state) => ({
          soundEnabled: state.soundEnabled,
          hapticEnabled: state.hapticEnabled,
          spinHistory: state.spinHistory.slice(0, 50), // Keep last 50 spins
        }),
      }
    ),
    {
      name: "wheel-store",
    }
  )
);

// Selector hooks for better performance
export const useWheelConfig = () => useWheelStore((state) => state.wheelConfig);
export const useIsSpinning = () => useWheelStore((state) => state.isSpinning);
export const useSpinHistory = () => useWheelStore((state) => state.spinHistory);
export const useCanSpin = () => useWheelStore((state) => state.canSpin());
export const useCooldownRemaining = () =>
  useWheelStore((state) => state.cooldownRemaining);
export const useUserPreferences = () =>
  useWheelStore((state) => ({
    soundEnabled: state.soundEnabled,
    hapticEnabled: state.hapticEnabled,
  }));
