export type ApiCandidateMini = { id: string; name: string };

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
  topicType: string;      
  content?: string | null;
  order: number;
  resources: ApiExternalResource[];
  contents: ApiTopicContent[];
  proposals: ApiProposal[]; 
};

export type CreateTopicPayload = {
  title: string;
  topicType: "HEALTH" | "WORK" | "SECURITY" | "EDUCATION" | "ECONOMY" | "ENVIRONMENT" | "OTHER"; // ✅
  content?: string;
  order?: number;
  resources?: Array<{ type: string; title: string; url: string; description?: string; order?: number }>;
  candidateId?: string;
  proposalContent?: string;
};

export type ApiProposal = {
  id: string;
  candidateId: string;
  topicId: string;
  content: string;
  candidate: ApiCandidateMini;
};
