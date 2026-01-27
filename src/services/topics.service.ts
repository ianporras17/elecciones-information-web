import type { ApiTopic, CreateTopicPayload, ApiExternalResource } from "../types/topic.api.types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const topicsService = {
  listByRoom(roomId: string) {
    return http<ApiTopic[]>(`/rooms/${roomId}/topics`);
  },

  create(roomId: string, payload: CreateTopicPayload) {
    return http<ApiTopic>(`/rooms/${roomId}/topics`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  get(topicId: string) {
    return http<ApiTopic>(`/topics/${topicId}`);
  },

  addResource(topicId: string, payload: { type: string; title: string; url: string; description?: string; order?: number }) {
    return http<ApiExternalResource>(`/topics/${topicId}/resources`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  upsertContent(topicId: string, payload: { participantId: string; content: string }) {
    return http(`/topics/${topicId}/contents`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteResource(resourceId: string) {
    return http<void>(`/external-resources/${resourceId}`, {
        method: "DELETE",
    });
    },

};
