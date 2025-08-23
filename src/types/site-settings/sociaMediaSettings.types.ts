export interface SocialMediaIcon {
  id: number;
  name: string;
  url: string;
}

export type SocialMediaIconsResponse = SocialMediaIcon[];

export interface CreateSocialMediaIconPayload {
  name: string;
  url: string;
}

export interface UpdateSocialMediaIconPayload {
  name?: string;
  url?: string;
}