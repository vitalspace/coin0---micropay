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

export interface IMemoData {
  transaction_hash: string;
  creator_address: string;
  contractId: number;
  user_address: string;
  memo: string;
  type: 'donation' | 'purchase';
  amount: number; // Amount in octas
}

export interface IMessageData {
  sender_address: string;
  receiver_address: string;
  campaign_id?: number;
  message: string;
  subject?: string;
}
