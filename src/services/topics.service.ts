import api from "./auth.service";
import type { ApiTopic, CreateTopicPayload, ApiExternalResource } from "../types/topic.api.types";

export const topicsService = {
  async listByRoom(roomId: string) {
    const res = await api.get<ApiTopic[]>(`/rooms/${roomId}/topics`);
    return res.data;
  },

  async create(roomId: string, payload: CreateTopicPayload) {
    const res = await api.post<ApiTopic>(`/rooms/${roomId}/topics`, payload);
    return res.data;
  },

  async get(topicId: string) {
    const res = await api.get<ApiTopic>(`/topics/${topicId}`);
    return res.data;
  },

  async addResource(
    topicId: string,
    payload: { type: string; title: string; url: string; description?: string; order?: number }
  ) {
    const res = await api.post<ApiExternalResource>(`/topics/${topicId}/resources`, payload);
    return res.data;
  },

  async upsertContent(topicId: string, payload: { participantId: string; content: string }) {
    const res = await api.put(`/topics/${topicId}/contents`, payload);
    return res.data;
  },

  async deleteResource(resourceId: string) {
    const res = await api.delete(`/external-resources/${resourceId}`);
    return res.data;
  },
};
