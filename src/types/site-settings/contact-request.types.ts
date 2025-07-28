export interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export type ContactRequestsResponse = ContactRequest[];

export interface UpdateContactRequestPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}