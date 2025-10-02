export interface WalletState {
  isConnected: boolean;
  address: string;
}

export interface Payment {
  id: string;
  amount: number;
  from: string;
  timestamp: Date;
  message?: string;
}

export interface Donor {
  address: string;
  totalAmount: number;
  paymentCount: number;
}

export interface UserProfile {
  address: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  following?: number;
  posts?: number;
  createdAt: Date;
}

export interface AnalyticsData {
  dailyIncome: { date: string; amount: number }[];
  weeklyIncome: { week: string; amount: number }[];
  donorRanking: Donor[];
  trafficSources: { source: string; visits: number }[];
}

export type CampaignType = "donation" | "business" | "product";

export interface Campaign {
  id: string;
  type: CampaignType;
  title: string;
  description: string;
  goal?: number; // For donations
  price?: number; // For products
  image?: string;
  paymentLink: string;
  balance: number;
  totalRaised: number;
  supporterCount: number;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
