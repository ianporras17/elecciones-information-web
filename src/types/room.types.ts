export type RoomStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE';

export type RoomType = 'PRESIDENTIAL';

export interface CreateRoomPayload {
  name: string;
  description: string;
  roomType: RoomType;
  config: PresidentialConfig;
}

export interface PresidentialConfig {
  candidatesEnabled: boolean;
  topicsEnabled: boolean;
  newsEnabled: boolean;
}
