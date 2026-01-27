export type ApiExternalResource = {
  id: string;
  topicId: string;
  type: string;     
  title: string;
  url: string;
  description?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiTopicContent = {
  id: string;
  topicId: string;
  participantId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiTopic = {
  id: string;
  roomId: string;
  title: string;
  content?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  resources: ApiExternalResource[];
  contents: ApiTopicContent[];
};

export type CreateTopicPayload = {
  title: string;
  content?: string;
  order?: number;
  resources?: Array<{
    type: string;
    title: string;
    url: string;
    description?: string;
    order?: number;
  }>;
};
