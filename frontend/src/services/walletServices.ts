import type {
  AnalyticsData,
  Campaign,
  Donor,
  Payment,
  UserProfile,
  WalletState,
} from "@/types/types";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { writable, get } from "svelte/store";
import { profile, createUser } from "@services/api.services";
import { contractService } from "@services/contract.services";

export const walletStore = writable<WalletState>({
  isConnected: false,
  address: "",
});

export const userStore = writable<UserProfile>({
  address: "",
  avatar: "",
  nickname: "",
  createdAt: new Date(),
  followers: 0,
  following: 0,
  posts: 0,
});

const config = new AptosConfig({
  network: Network.TESTNET,
});

const aptos = new Aptos(config);

class WalletService {
  aptosProvider: Aptos = aptos;

  constructor() {
    this.checkConnection();
  }

  private updateUserProfile(updated: Partial<UserProfile>) {
    userStore.update((state) => ({ ...state, ...updated }));
  }

  private updateWallet(updated: Partial<WalletState>) {
    walletStore.update((state) => ({ ...state, ...updated }));
  }

  async connectWallet(): Promise<void> {
    try {
      //@ts-ignore
      if (window.aptos) {
        //@ts-ignore
        const response = await window.aptos.connect();
        this.updateWallet({ isConnected: true, address: response.address });

        // console.log("Wallet connected:", response);

        if (response) {
          try {
            const result = await createUser({ address: response.address });
            if (result && result.data) this.updateUserProfile(result.data);
          } catch (error) {
            //console.error("Error creating user:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  }

  async disconnectWallet(): Promise<void> {
    try {
      //@ts-ignore
      if (window.aptos) {
        //@ts-ignore

        await window.aptos.disconnect();
        this.updateWallet({ isConnected: false, address: "" });
      }
    } catch (error) {
      console.error("Error disconnecting from wallet:", error);
    }
  }

  async checkConnection(): Promise<void> {
    try {
      //@ts-ignore
      if (window.aptos && window.aptos.isConnected) {
        //@ts-ignore
        const response = await window.aptos.isConnected();

        if (response) {
          //@ts-ignore
          const account = await window.aptos.account();
          this.updateWallet({ isConnected: true, address: account.address });

          try {
            const userProfile = await profile({ address: account.address });

            console.log("Fetched user profile:", userProfile.data);

            if (userProfile && userProfile.data) {
              this.updateUserProfile(userProfile.data);
            }
          } catch (error) {}
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  }

  async getBalance(): Promise<number> {
    try {
      const userAddress = get(walletStore).address;
      if (!userAddress) return 0;

      const campaignIds = await contractService.getActiveCampaigns(userAddress);
      let totalBalance = 0n;

      for (const campaignId of campaignIds) {
        const balance = await contractService.getCampaignBalance(userAddress, campaignId);
        totalBalance += BigInt(balance);
      }

      return Number(totalBalance);
    } catch (error) {
      console.error("Error getting balance:", error);
      return 0;
    }
  }

  async getPaymentHistory(): Promise<Payment[]> {
    // Mock payment history
    return [
      {
        id: "1",
        amount: 10,
        from: "0x123...abc",
        timestamp: new Date("2025-09-25"),
        message: "Thanks for the content!",
      },
      {
        id: "2",
        amount: 5,
        from: "0x456...def",
        timestamp: new Date("2025-09-24"),
        message: "Great work",
      },
      {
        id: "3",
        amount: 20,
        from: "0x789...ghi",
        timestamp: new Date("2025-09-23"),
      },
    ];
  }

  async getTopDonors(): Promise<Donor[]> {
    // Mock top donors
    return [
      { address: "0x123...abc", totalAmount: 150, paymentCount: 5 },
      { address: "0x456...def", totalAmount: 100, paymentCount: 3 },
      { address: "0x789...ghi", totalAmount: 80, paymentCount: 2 },
    ];
  }

  async withdrawFunds(amount: number): Promise<void> {
    // Mock withdraw: simulate calling smart contract
    console.log(`Withdrawing ${amount} APT`);
    // In real: await this.aptosProvider.signAndSubmitTransaction({ ... });
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    // Mock analytics
    return {
      dailyIncome: [
        { date: "2025-09-20", amount: 10 },
        { date: "2025-09-21", amount: 15 },
        { date: "2025-09-22", amount: 20 },
      ],
      weeklyIncome: [
        { week: "Week 1", amount: 45 },
        { week: "Week 2", amount: 60 },
      ],
      donorRanking: await this.getTopDonors(),
      trafficSources: [
        { source: "Direct", visits: 50 },
        { source: "Twitter", visits: 30 },
        { source: "Discord", visits: 20 },
      ],
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    // Mock campaigns
    const mockCampaigns: Campaign[] = [
      {
        id: "1",
        type: "donation",
        title: "Support My Art",
        description: "Help me create more digital art",
        goal: 1000,
        paymentLink: "https://aptosmicropay.com/c/1",
        balance: 0.02,
        totalRaised: 0.02,
        donorCount: 15,
        isActive: true,
        createdAt: new Date("2025-09-01"),
        updatedAt: new Date("2025-09-25"),
      },
      {
        id: "2",
        type: "product",
        title: "Digital Art Pack",
        description: "Collection of 10 digital artworks",
        price: 50,
        paymentLink: "https://aptosmicropay.com/c/2",
        balance: 0.01,
        totalRaised: 0.01,
        donorCount: 6,
        isActive: true,
        createdAt: new Date("2025-09-05"),
        updatedAt: new Date("2025-09-24"),
      },
      {
        id: "3",
        type: "business",
        title: "Coffee Shop Tips",
        description: "Support our local coffee shop",
        paymentLink: "https://aptosmicropay.com/c/3",
        balance: 0.01,
        totalRaised: 0.01,
        donorCount: 25,
        isActive: true,
        createdAt: new Date("2025-09-10"),
        updatedAt: new Date("2025-09-23"),
      },
    ];
    return mockCampaigns;
  }

  async createCampaign(
    campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">
  ): Promise<Campaign> {
    // Mock create
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newCampaign;
  }

  async updateCampaign(
    id: string,
    updates: Partial<Campaign>
  ): Promise<Campaign> {
    // Mock update
    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) throw new Error("Campaign not found");
    return { ...campaign, ...updates, updatedAt: new Date() };
  }

  async getCampaignBalance(campaignId: string): Promise<number> {
    // Mock per campaign balance
    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find((c) => c.id === campaignId);
    return campaign?.balance || 0;
  }

  async getCampaignHistory(campaignId: string): Promise<Payment[]> {
    // Mock per campaign history
    return [
      {
        id: "p1",
        amount: 10,
        from: "0x123...abc",
        timestamp: new Date("2025-09-25"),
        message: "Great work!",
      },
      {
        id: "p2",
        amount: 5,
        from: "0x456...def",
        timestamp: new Date("2025-09-24"),
      },
    ];
  }

  async getProfile(): Promise<UserProfile> {
    // Mock: get from localStorage or default
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      username: "creator",
      publicName: "",
      avatar: "",
      description: "",
      emailNotifications: false,
      telegramNotifications: false,
    };
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    // Mock: save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }
}

export const walletService = new WalletService();

console.log(import.meta.env.VITE_API_URL);
