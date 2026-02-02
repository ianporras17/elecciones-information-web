import api from "./auth.service";

export type ApiCandidate = {
  id: string;
  roomId: string;
  name: string;
};

export const candidatesService = {
  async list(roomId: string) {
    const res = await api.get<ApiCandidate[]>(`/rooms/${roomId}/candidates`);
    return res.data;
  },

  async create(roomId: string, name: string) {
    const res = await api.post<ApiCandidate>(`/rooms/${roomId}/candidates`, { name });
    return res.data;
  },
};
