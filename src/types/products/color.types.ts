export interface Color {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  image: string;
  note: string;
}

export type ColorResponse = Color[];

export interface CreateColorPayload {
  name: string;
  image?: File;
  note?: string;
}

export interface UpdateColorPayload {
  name?: string;
  image?: File;
  note?: string;
}