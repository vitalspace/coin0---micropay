export type CampaignType = "donation" | "business" | "product";

export interface IUser {
  address: string;
  avatar: string;
  nickname: string;
}

export interface ICampaignData {
  type: CampaignType;
  name: string;
  description: string;
  goal?: number; // Para campañas de donación
  price?: number; // Para campañas de producto
  image?: string;
  isActive: boolean;
  createdBy: string;
}
