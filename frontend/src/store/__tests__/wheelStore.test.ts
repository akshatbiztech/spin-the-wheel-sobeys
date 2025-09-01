import { renderHook, act } from "@testing-library/react-hooks";
import { useWheelStore } from "../index";
import { SpinResult } from "../../types";

// Mock the store for testing
const createTestStore = () => {
  const { result } = renderHook(() => useWheelStore());
  return result;
};

describe("Wheel Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useWheelStore.setState({
        isSpinning: false,
        currentSpinResult: null,
        spinHistory: [],
        nextAllowedSpinAt: null,
        cooldownRemaining: 0,
      });
    });
  });

  describe("Spin Actions", () => {
    it("should start spin correctly", () => {
      const store = createTestStore();

      act(() => {
        store.current.startSpin();
      });

      expect(store.current.isSpinning).toBe(true);
    });

    it("should complete spin and update history", () => {
      const store = createTestStore();
      const mockResult: SpinResult = {
        id: "spin-1",
        userId: "user-1",
        itemId: "item-1",
        itemName: "Free Coffee",
        timestamp: new Date(),
      };

      act(() => {
        store.current.startSpin();
        store.current.completeSpin(mockResult);
      });

      expect(store.current.isSpinning).toBe(false);
      expect(store.current.currentSpinResult).toEqual(mockResult);
      expect(store.current.spinHistory).toHaveLength(1);
      expect(store.current.spinHistory[0]).toEqual(mockResult);
    });
  });

  describe("Cooldown Management", () => {
    it("should set next allowed spin time", () => {
      const store = createTestStore();
      const futureTime = Date.now() + 60000; // 1 minute from now

      act(() => {
        store.current.setNextAllowedSpinAt(futureTime);
      });

      expect(store.current.nextAllowedSpinAt).toBe(futureTime);
    });

    it("should check if user can spin", () => {
      const store = createTestStore();

      // Should be able to spin initially
      expect(store.current.canSpin()).toBe(true);

      // Set future cooldown
      act(() => {
        store.current.setNextAllowedSpinAt(Date.now() + 60000);
      });

      // Should not be able to spin during cooldown
      expect(store.current.canSpin()).toBe(false);

      // Set past cooldown
      act(() => {
        store.current.setNextAllowedSpinAt(Date.now() - 60000);
      });

      // Should be able to spin after cooldown
      expect(store.current.canSpin()).toBe(true);
    });

    it("should not allow spinning while already spinning", () => {
      const store = createTestStore();

      act(() => {
        store.current.startSpin();
      });

      expect(store.current.canSpin()).toBe(false);
    });
  });

  describe("History Management", () => {
    it("should add spins to history", () => {
      const store = createTestStore();
      const mockResult: SpinResult = {
        id: "spin-1",
        userId: "user-1",
        itemId: "item-1",
        itemName: "Free Coffee",
        timestamp: new Date(),
      };

      act(() => {
        store.current.addSpinToHistory(mockResult);
      });

      expect(store.current.spinHistory).toHaveLength(1);
      expect(store.current.spinHistory[0]).toEqual(mockResult);
    });

    it("should set entire history", () => {
      const store = createTestStore();
      const mockHistory: SpinResult[] = [
        {
          id: "spin-1",
          userId: "user-1",
          itemId: "item-1",
          itemName: "Free Coffee",
          timestamp: new Date(),
        },
        {
          id: "spin-2",
          userId: "user-1",
          itemId: "item-2",
          itemName: "50 Points",
          timestamp: new Date(),
        },
      ];

      act(() => {
        store.current.setSpinHistory(mockHistory);
      });

      expect(store.current.spinHistory).toEqual(mockHistory);
    });
  });

  describe("User Preferences", () => {
    it("should toggle sound preference", () => {
      const store = createTestStore();

      expect(store.current.soundEnabled).toBe(true);

      act(() => {
        store.current.toggleSound();
      });

      expect(store.current.soundEnabled).toBe(false);

      act(() => {
        store.current.toggleSound();
      });

      expect(store.current.soundEnabled).toBe(true);
    });

    it("should toggle haptic preference", () => {
      const store = createTestStore();

      expect(store.current.hapticEnabled).toBe(true);

      act(() => {
        store.current.toggleHaptic();
      });

      expect(store.current.hapticEnabled).toBe(false);
    });
  });

  describe("Loading States", () => {
    it("should manage loading states correctly", () => {
      const store = createTestStore();

      act(() => {
        store.current.setLoadingState("spin", { isLoading: true });
      });

      expect(store.current.loadingStates.spin.isLoading).toBe(true);

      act(() => {
        store.current.setLoadingState("spin", {
          isLoading: false,
          error: "Test error",
        });
      });

      expect(store.current.loadingStates.spin.isLoading).toBe(false);
      expect(store.current.loadingStates.spin.error).toBe("Test error");
    });
  });

  describe("Utility Actions", () => {
    it("should reset spin state", () => {
      const store = createTestStore();

      // Set some state
      act(() => {
        store.current.startSpin();
        store.current.setSpinResult({
          id: "test",
          userId: "user-1",
          itemId: "item-1",
          itemName: "Test",
          timestamp: new Date(),
        });
      });

      expect(store.current.isSpinning).toBe(true);
      expect(store.current.currentSpinResult).toBeTruthy();

      // Reset
      act(() => {
        store.current.resetSpinState();
      });

      expect(store.current.isSpinning).toBe(false);
      expect(store.current.currentSpinResult).toBeNull();
    });
  });
});
