import { apiClient } from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper function to convert logo URLs to use the proxy
export function getProxiedLogoUrl(logoUrl: string | undefined): string | undefined {
  if (!logoUrl) return undefined;

  // If it's a Clearbit URL, proxy it through our backend
  if (logoUrl.includes('logo.clearbit.com')) {
    return `${API_BASE_URL}/ai-tools/logo-proxy?url=${encodeURIComponent(logoUrl)}`;
  }

  // Return other URLs as-is
  return logoUrl;
}

export interface AIToolReview {
  _id?: string;
  userId: string;
  username: string;
  designation: string;
  rating: number;
  comment: string;
}

export interface AIToolPricingDetail {
  type: string;
  features: string;
}

export interface AIToolPricing {
  plan: string;
  details: AIToolPricingDetail[];
}

export interface AITool {
  _id: string;
  name: string;
  categories: string[];
  description?: string;
  website?: string;
  logo_url?: string;
  release_year?: number;
  skill_level?: string;
  trending?: boolean;
  founders?: string[];
  total_rating?: number;
  reviews?: AIToolReview[];
  pricing?: AIToolPricing;
  createdAt?: string;
  // ...add other fields as needed
}

export interface GetAllAIToolsResponse {
  data?: AITool[];
  error?: string;
  status?: number;
}

export const aiService = {
  async getAllAITools(): Promise<GetAllAIToolsResponse> {
    return apiClient<AITool[]>("/ai-tools/ai/all", {
      method: "GET",
      credentials: "include",
    });
  },

  async getAIToolById(id: string): Promise<{ data?: AITool; error?: string }> {
    return apiClient<AITool>(`/ai-tools/ai/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },

  async getReviews(
    toolId: string
  ): Promise<{ data?: AIToolReview[]; error?: string }> {
    return apiClient<AIToolReview[]>(`/ai-tools/ai/${toolId}/reviews`, {
      method: "GET",
      credentials: "include",
    });
  },

  async addReview(
    toolId: string,
    rating: number,
    comment: string
  ): Promise<{ data?: AIToolReview; error?: string }> {
    return apiClient<AIToolReview>(`/ai-tools/ai/${toolId}/review`, {
      method: "POST",
      body: JSON.stringify({ rating, comment }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  },

  async deleteReview(
    toolId: string,
    reviewId: string
  ): Promise<{ message?: string; error?: string }> {
    return apiClient<{ message: string }>(
      `/ai-tools/ai/${toolId}/review/${reviewId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  },
  // Add other AI tool service methods here as needed
};
