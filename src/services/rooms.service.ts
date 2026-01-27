import type { ApiRoom, CreateRoomApiPayload } from '../types/room.api.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const roomsService = {
  createRoom(payload: CreateRoomApiPayload) {
    return http<ApiRoom>('/rooms', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listRooms() {
    return http<ApiRoom[]>('/rooms');
  },

  getRoom(id: string) {
    return http<ApiRoom>(`/rooms/${id}`);
  },

  joinRoom(accessCode: string) {
    return http<ApiRoom>('/rooms/join', {
      method: 'POST',
      body: JSON.stringify({ accessCode }),
    });
  },

  updateRoom(id: string, payload: { status?: "ACTIVE" | "INACTIVE"; name?: string }) {
    return http<ApiRoom>(`/rooms/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    },
};


