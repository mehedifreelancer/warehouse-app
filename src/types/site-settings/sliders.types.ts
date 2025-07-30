export interface Slider {
  id: number;
  image: string | null;
  sub_title: string;
  intro_one: string;
  intro_two: string;
  offer_text: string;
  category: number;
}

export type SlidersResponse = Slider[];

export interface CreateSliderPayload {
  image?: File | null;
  sub_title: string;
  intro_one: string;
  intro_two: string;
  offer_text: string;
  category: number;
}

export interface UpdateSliderPayload {
  image?: File | null;
  sub_title?: string;
  intro_one?: string;
  intro_two?: string;
  offer_text?: string;
  category?: number;
}