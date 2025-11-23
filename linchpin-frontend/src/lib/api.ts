// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // For cookies if using httpOnly tokens
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: data?.message || "Something went wrong",
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (error) {
    console.error("API Client Error:", error);
    return {
      error: "Network error. Please try again.",
      status: 500,
    };
  }
}
