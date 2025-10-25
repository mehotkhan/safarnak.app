// API-specific types and interfaces
// Client-side types for API operations

export interface ApiError {
  message: string;
  code?: string;
  extensions?: Record<string, any>;
}

export interface ApiResponse<T> {
  data?: T;
  errors?: ApiError[];
  loading: boolean;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
}

export interface ApiConfig {
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};
