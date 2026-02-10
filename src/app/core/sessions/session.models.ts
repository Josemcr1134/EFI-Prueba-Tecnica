export type SessionStatus = 'draft' | 'blocked' | 'hidden';

export interface SessionItem {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  dateTime: string;
  status: SessionStatus;
  imageUrl?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
