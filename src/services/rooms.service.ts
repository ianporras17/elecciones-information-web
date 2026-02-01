import api from "./auth.service";
import type { ApiRoom, CreateRoomApiPayload } from "../types/room.api.types";

export const roomsService = {
  async createRoom(payload: CreateRoomApiPayload) {
    const res = await api.post<ApiRoom>("/rooms", payload);
    return res.data;
  },

  async listRooms() {
    const res = await api.get<ApiRoom[]>("/rooms");
    return res.data;
  },

  async getRoom(id: string) {
    const res = await api.get<ApiRoom>(`/rooms/${id}`);
    return res.data;
  },

  async joinRoom(accessCode: string) {
    const res = await api.post<ApiRoom>("/rooms/join", { accessCode });
    return res.data;
  },

  async updateRoom(
    id: string,
    payload: { status?: "ACTIVE" | "INACTIVE"; name?: string; description?: string }
  ) {
    const res = await api.put<ApiRoom>(`/rooms/${id}`, payload);
    return res.data;
  },

  async getMembers(roomId: string) {
    const res = await api.get<any[]>(`/rooms/${roomId}/members`);
    return res.data;
  },
};
