// Base document interface
export interface BaseDocument {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User interface
export interface User extends BaseDocument {
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Example interface for spin wheel items
export interface SpinWheelItem extends BaseDocument {
  name: string;
  weight?: number;
  color?: string;
  isActive?: boolean;
}

// Example interface for spin results
export interface SpinResult extends BaseDocument {
  userId: string;
  itemId: string;
  timestamp: Date;
  itemName: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}
