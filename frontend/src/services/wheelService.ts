import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";
import { SpinResult, ApiResponse } from "../types";

// Types for Cloud Function calls
export interface SpinWheelRequest {
  clientRequestId: string; // For idempotency
  userId?: string;
}

export interface SpinWheelResponse {
  success: boolean;
  data?: {
    spinId: string;
    winningSegment: {
      id: string;
      name: string;
      weight: number;
      color: string;
    };
    nextAllowedAt: number; // timestamp
    cooldownSeconds: number;
  };
  error?: string;
}

export interface GetHistoryRequest {
  userId?: string;
  limit?: number;
  offset?: number;
}

// Interface matching the actual Firebase Cloud Function response
export interface SpinHistoryItem {
  spinId: string;
  winningIndex: number;
  prizeLabel: string;
  createdAt: string; // ISO date string
}

export interface GetHistoryResponse {
  success: boolean;
  data?: SpinHistoryItem[];
  error?: string;
}

// Cloud Function names
const FUNCTION_NAMES = {
  SPIN_WHEEL: "spinWheel",
  GET_HISTORY: "getHistory",
} as const;

class WheelService {
  private generateRequestId(): string {
    return `spin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Spin the wheel via Firebase Cloud Function
   * This ensures server-authoritative results
   */
  async spinWheel(userId?: string): Promise<SpinWheelResponse> {
    try {
      const spinWheelFunction = httpsCallable<
        SpinWheelRequest,
        SpinWheelResponse
      >(functions, FUNCTION_NAMES.SPIN_WHEEL);

      const requestId = this.generateRequestId();
      const result = await spinWheelFunction({
        clientRequestId: requestId,
        userId,
      });

      return result.data;
    } catch (error) {
      console.error("Error spinning wheel:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to spin wheel"
      );
    }
  }

  /**
   * Get user's spin history
   */
  async getSpinHistory(
    userId?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<GetHistoryResponse> {
    try {
      const getHistoryFunction = httpsCallable<
        GetHistoryRequest,
        SpinHistoryItem[]
      >(functions, FUNCTION_NAMES.GET_HISTORY);

      const result = await getHistoryFunction({
        userId,
        limit,
        offset,
      });

      // The Firebase function returns the array directly, not wrapped in success/data
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("Error getting spin history:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get spin history",
      };
    }
  }

  /**
   * Convert Cloud Function response to SpinResult
   */
  convertToSpinResult(
    response: SpinWheelResponse["data"],
    userId?: string
  ): SpinResult | null {
    if (!response) return null;

    return {
      id: response.spinId,
      userId: userId || "anonymous",
      itemId: response.winningSegment.id,
      itemName: response.winningSegment.name,
      timestamp: new Date(),
    };
  }

  /**
   * Check if user can spin (client-side validation)
   * Note: Server-side validation is authoritative
   */
  canSpin(nextAllowedAt: number | null): boolean {
    if (!nextAllowedAt) return true;
    return Date.now() >= nextAllowedAt;
  }

  /**
   * Calculate remaining cooldown time
   */
  getCooldownRemaining(nextAllowedAt: number | null): number {
    if (!nextAllowedAt) return 0;
    const remaining = Math.max(0, nextAllowedAt - Date.now());
    return Math.ceil(remaining / 1000); // Convert to seconds
  }
}

// Export singleton instance
export const wheelService = new WheelService();
