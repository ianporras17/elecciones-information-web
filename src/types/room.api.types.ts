export type ApiRoom = {
  id: string;
  title: string;
  description?: string | null;
  accessCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoomApiPayload = {
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
};
