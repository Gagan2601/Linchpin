import { apiClient } from "@/lib/api";
import { User } from "@/services/auth"; // reuse your base User type

export interface UpdateUserPayload {
  username?: string;
  aboutMe?: string;
  savedAIs?: string[];
}

export interface UpdateUserResponse {
  data?: User;
  status?: number;
  error?: string;
}

export const userService = {
  async getUser(id: string): Promise<{ data?: User; error?: string }> {
    return apiClient<User>(`/user/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },

  async updateUser(
    id: string,
    payload: UpdateUserPayload
  ): Promise<UpdateUserResponse> {
    return apiClient<User>(`/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  },

  async deleteUser(id: string): Promise<{ message?: string; error?: string }> {
    return apiClient<{ message: string }>(`/user/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
