export type ApiRoom = {
  id: string;
  title: string;
  accessCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoomApiPayload = {
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
};
