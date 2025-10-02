import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export interface ContractState {
  isInitialized: boolean;
  // You can add more state properties as needed
}

export class ContractService {
  private aptos: Aptos;

  private readonly MODULE = "campaigns_per_user";
  private readonly CONTRACT_ADDRESS =
    "6800459b7d152eaa62c9ceaf2cf7b1b5f45e68a18cb2cd462c00b079f65d9dad";

  constructor() {
    const config = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(config);
  }

  initializeContract = async () => {
    try {
      // Check if wallet is available and connected
      console.log("Checking wallet availability for initialization...");
      //@ts-ignore
      if (!window.aptos) {
        console.error("window.aptos is undefined - wallet not found");
        throw new Error(
          "Aptos wallet not found. Please install a wallet extension like Petra or Martian."
        );
      }

      console.log("Wallet found, checking connection for initialization...");
      // Check if wallet is connected
      let isConnected = false;
      try {
        //@ts-ignore
        isConnected = await window.aptos.isConnected();
        console.log(
          "Wallet connection status for initialization:",
          isConnected
        );
      } catch (connectionError) {
        console.error(
          "Error checking wallet connection for initialization:",
          connectionError
        );
        throw new Error(
          "Unable to check wallet connection status. Please ensure your wallet is properly installed and connected."
        );
      }

      if (!isConnected) {
        console.log(
          "Wallet not connected, attempting to connect for initialization..."
        );
        try {
          //@ts-ignore
          await window.aptos.connect();
          console.log("Wallet connection successful for initialization");
        } catch (connectError) {
          console.error(
            "Error connecting wallet for initialization:",
            connectError
          );
          throw new Error(
            "Please connect your Aptos wallet to initialize the contract."
          );
        }
      }

      const payload = {
        function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::initialize`,
        typeArguments: [],
        arguments: [],
      };

      //@ts-ignore
      const response = await window.aptos.signAndSubmitTransaction({ payload });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Contract initialized successfully");
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw error;
    }
  };

  createCampaign = async (
    type: string,
    name: string,
    description: string,
    goal: string,
    price: string,
    image: string
  ) => {
    try {
      // Validate required parameters
      if (!name || !description || !image) {
        throw new Error("Name, description, and image are required");
      }

      let functionName: string;
      let functionArgs: string[];

      switch (parseInt(type)) {
        case 0: // DONATION
          if (!goal) {
            throw new Error("Goal is required for donation campaigns");
          }
          functionName = "create_donation_campaign";
          functionArgs = [name, description, goal, image];
          break;
        case 1: // BUSINESS
          if (!price) {
            throw new Error("Price is required for business campaigns");
          }
          functionName = "create_business_campaign";
          functionArgs = [name, description, price, image];
          break;
        case 2: // PRODUCT
          if (!price) {
            throw new Error("Price is required for product campaigns");
          }
          functionName = "create_product_campaign";
          functionArgs = [name, description, price, image];
          break;
        default:
          throw new Error("Invalid campaign type");
      }

      // Ensure all arguments are strings and not empty
      functionArgs = functionArgs.map((arg) => {
        if (arg === null || arg === undefined) {
          throw new Error("All campaign parameters must be provided");
        }
        return arg.toString();
      });

      const payload = {
        type: "entry_function_payload",
        function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::${functionName}`,
        type_arguments: [],
        arguments: functionArgs,
      };

      // Check if wallet is available and connected
      console.log("Checking wallet availability...");
      //@ts-ignore
      if (!window.aptos) {
        console.error("window.aptos is undefined - wallet not found");
        throw new Error(
          "Aptos wallet not found. Please install a wallet extension like Petra or Martian and connect it to this application."
        );
      }

      console.log("Wallet found, checking connection...");
      // Check if wallet is connected
      let isConnected = false;
      try {
        //@ts-ignore
        isConnected = await window.aptos.isConnected();
        console.log("Wallet connection status:", isConnected);
      } catch (connectionError) {
        console.error("Error checking wallet connection:", connectionError);
        throw new Error(
          "Unable to check wallet connection status. Please ensure your wallet is properly installed and connected."
        );
      }

      if (!isConnected) {
        console.log("Wallet not connected, attempting to connect...");
        try {
          //@ts-ignore
          await window.aptos.connect();
          console.log("Wallet connection successful");
        } catch (connectError) {
          console.error("Error connecting wallet:", connectError);
          throw new Error(
            "Please connect your Aptos wallet to create campaigns."
          );
        }
      }

      //@ts-ignore
      const response = await window.aptos.signAndSubmitTransaction({ payload });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });

      // Get the campaign ID (assuming it's the total campaigns count)
      const walletAddress = await this.getWalletAddress();
      let contractId: number;
      try {
        contractId = await this.getTotalCampaigns(walletAddress);
      } catch (error) {
        console.error("Failed to get total campaigns, using fallback:", error);
        // Fallback: assume this is the next campaign
        contractId = 1; // Or get from local storage or something
      }
      return { contractId, transactionHash: response.hash };
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  };

  private getWalletAddress = async (): Promise<string> => {
    //@ts-ignore
    const account = await window.aptos.account();
    return account.address;
  };

  getCampaignsByCreator = async (creatorAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_campaigns_by_creator`,
          functionArguments: [creatorAddr],
        },
      });

      console.log("Campaigns by creator result:", result);

      return result[0] as number[];
    } catch (error) {
      console.error("Error getting campaigns by creator:", error);
      throw error;
    }
  };

  getActiveCampaigns = async (userAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_active_campaigns`,
          functionArguments: [userAddr],
        },
      });

      console.log("Active campaigns result:", result);

      return result[0] as number[];
    } catch (error) {
      console.error("Error getting active campaigns:", error);
      throw error;
    }
  };

  getCampaign = async (userAddr: string, campaignId: number) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_campaign`,
          typeArguments: [],
          functionArguments: [userAddr, campaignId.toString()],
        },
      });
      return result as [
        number,
        number,
        string,
        string,
        number,
        number,
        string,
        boolean,
        string,
        number,
        number,
      ];
    } catch (error) {
      console.error("Error getting campaign:", error);
      throw error;
    }
  };

  getTotalCampaigns = async (userAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_total_campaigns`,
          typeArguments: [],
          functionArguments: [userAddr],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error("Error getting total campaigns:", error);
      throw error;
    }
  };

  campaignExists = async (userAddr: string, campaignId: number) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::campaign_exists`,
          typeArguments: [],
          functionArguments: [userAddr, campaignId.toString()],
        },
      });
      return result[0] as boolean;
    } catch (error) {
      console.error("Error checking campaign exists:", error);
      throw error;
    }
  };

  getCampaignBalance = async (userAddr: string, campaignId: number) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_campaign_balance`,
          typeArguments: [],
          functionArguments: [userAddr, campaignId.toString()],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error("Error getting campaign balance:", error);
      throw error;
    }
  };

  getDonationHistory = async (userAddr: string, campaignId: number) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_donation_history`,
          typeArguments: [],
          functionArguments: [userAddr, campaignId.toString()],
        },
      });
      return result[0] as Array<{
        donor: string;
        campaign_id: number;
        amount: number;
        donated_at: number;
      }>;
    } catch (error) {
      console.error("Error getting donation history:", error);
      throw error;
    }
  };

  getPurchaseHistory = async (userAddr: string, campaignId: number) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_purchase_history`,
          typeArguments: [],
          functionArguments: [userAddr, campaignId.toString()],
        },
      });
      return result[0] as Array<{
        buyer: string;
        campaign_id: number;
        quantity: number;
        total_amount: number;
        purchased_at: number;
      }>;
    } catch (error) {
      console.error("Error getting purchase history:", error);
      throw error;
    }
  };

  donateToCampaign = async (creatorAddr: string, campaignId: number, amount: number) => {
    try {
      if (!creatorAddr || campaignId <= 0 || amount <= 0) {
        throw new Error("Invalid parameters for donation");
      }

      const payload = {
        type: "entry_function_payload",
        function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::donate_to_campaign`,
        type_arguments: [],
        arguments: [creatorAddr, campaignId.toString(), amount.toString()],
      };

      // Check if wallet is available and connected
      console.log("Checking wallet availability for donation...");
      //@ts-ignore
      if (!window.aptos) {
        console.error("window.aptos is undefined - wallet not found");
        throw new Error(
          "Aptos wallet not found. Please install a wallet extension like Petra or Martian."
        );
      }

      console.log("Wallet found, checking connection for donation...");
      let isConnected = false;
      try {
        //@ts-ignore
        isConnected = await window.aptos.isConnected();
        console.log("Wallet connection status for donation:", isConnected);
      } catch (connectionError) {
        console.error("Error checking wallet connection for donation:", connectionError);
        throw new Error(
          "Unable to check wallet connection status. Please ensure your wallet is properly installed and connected."
        );
      }

      if (!isConnected) {
        console.log("Wallet not connected, attempting to connect for donation...");
        try {
          //@ts-ignore
          await window.aptos.connect();
          console.log("Wallet connection successful for donation");
        } catch (connectError) {
          console.error("Error connecting wallet for donation:", connectError);
          throw new Error("Please connect your Aptos wallet to donate.");
        }
      }

      //@ts-ignore
      const response = await window.aptos.signAndSubmitTransaction({ payload });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Donation successful");
      return response;
    } catch (error) {
      console.error("Error donating to campaign:", error);
      throw error;
    }
  };

  purchaseProduct = async (creatorAddr: string, campaignId: number, quantity: number) => {
    try {
      if (!creatorAddr || campaignId <= 0 || quantity <= 0) {
        throw new Error("Invalid parameters for product purchase");
      }

      const payload = {
        type: "entry_function_payload",
        function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::purchase_product`,
        type_arguments: [],
        arguments: [creatorAddr, campaignId.toString(), quantity.toString()],
      };

      // Check if wallet is available and connected
      console.log("Checking wallet availability for product purchase...");
      //@ts-ignore
      if (!window.aptos) {
        console.error("window.aptos is undefined - wallet not found");
        throw new Error(
          "Aptos wallet not found. Please install a wallet extension like Petra or Martian."
        );
      }

      console.log("Wallet found, checking connection for product purchase...");
      let isConnected = false;
      try {
        //@ts-ignore
        isConnected = await window.aptos.isConnected();
        console.log("Wallet connection status for product purchase:", isConnected);
      } catch (connectionError) {
        console.error("Error checking wallet connection for product purchase:", connectionError);
        throw new Error(
          "Unable to check wallet connection status. Please ensure your wallet is properly installed and connected."
        );
      }

      if (!isConnected) {
        console.log("Wallet not connected, attempting to connect for product purchase...");
        try {
          //@ts-ignore
          await window.aptos.connect();
          console.log("Wallet connection successful for product purchase");
        } catch (connectError) {
          console.error("Error connecting wallet for product purchase:", connectError);
          throw new Error("Please connect your Aptos wallet to purchase product.");
        }
      }

      //@ts-ignore
      const response = await window.aptos.signAndSubmitTransaction({ payload });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Product purchase successful");
      return response;
    } catch (error) {
      console.error("Error purchasing product:", error);
      throw error;
    }
  };

  purchaseBusinessService = async (creatorAddr: string, campaignId: number) => {
    try {
      if (!creatorAddr || campaignId <= 0) {
        throw new Error("Invalid parameters for business service purchase");
      }

      const payload = {
        type: "entry_function_payload",
        function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::purchase_business_service`,
        type_arguments: [],
        arguments: [creatorAddr, campaignId.toString()],
      };

      // Check if wallet is available and connected
      console.log("Checking wallet availability for business service purchase...");
      //@ts-ignore
      if (!window.aptos) {
        console.error("window.aptos is undefined - wallet not found");
        throw new Error(
          "Aptos wallet not found. Please install a wallet extension like Petra or Martian."
        );
      }

      console.log("Wallet found, checking connection for business service purchase...");
      let isConnected = false;
      try {
        //@ts-ignore
        isConnected = await window.aptos.isConnected();
        console.log("Wallet connection status for business service purchase:", isConnected);
      } catch (connectionError) {
        console.error("Error checking wallet connection for business service purchase:", connectionError);
        throw new Error(
          "Unable to check wallet connection status. Please ensure your wallet is properly installed and connected."
        );
      }

      if (!isConnected) {
        console.log("Wallet not connected, attempting to connect for business service purchase...");
        try {
          //@ts-ignore
          await window.aptos.connect();
          console.log("Wallet connection successful for business service purchase");
        } catch (connectError) {
          console.error("Error connecting wallet for business service purchase:", connectError);
          throw new Error("Please connect your Aptos wallet to purchase business service.");
        }
      }

      //@ts-ignore
      const response = await window.aptos.signAndSubmitTransaction({ payload });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Business service purchase successful");
      return response;
    } catch (error) {
      console.error("Error purchasing business service:", error);
      throw error;
    }
  };

  withdrawFunds = async (campaignId: number, amount: number) => {
    try {
      if (campaignId <= 0 || amount <= 0) {
        throw new Error("Invalid parameters for fund withdrawal");
      }

      const payload = {
        type: "entry_function_payload",
        function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::withdraw_funds`,
        type_arguments: [],
        arguments: [campaignId.toString(), amount.toString()],
      };

      // Check if wallet is available and connected
      console.log("Checking wallet availability for fund withdrawal...");
      //@ts-ignore
      if (!window.aptos) {
        console.error("window.aptos is undefined - wallet not found");
        throw new Error(
          "Aptos wallet not found. Please install a wallet extension like Petra or Martian."
        );
      }

      console.log("Wallet found, checking connection for fund withdrawal...");
      let isConnected = false;
      try {
        //@ts-ignore
        isConnected = await window.aptos.isConnected();
        console.log("Wallet connection status for fund withdrawal:", isConnected);
      } catch (connectionError) {
        console.error("Error checking wallet connection for fund withdrawal:", connectionError);
        throw new Error(
          "Unable to check wallet connection status. Please ensure your wallet is properly installed and connected."
        );
      }

      if (!isConnected) {
        console.log("Wallet not connected, attempting to connect for fund withdrawal...");
        try {
          //@ts-ignore
          await window.aptos.connect();
          console.log("Wallet connection successful for fund withdrawal");
        } catch (connectError) {
          console.error("Error connecting wallet for fund withdrawal:", connectError);
          throw new Error("Please connect your Aptos wallet to withdraw funds.");
        }
      }

      //@ts-ignore
      const response = await window.aptos.signAndSubmitTransaction({ payload });

      await this.aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Fund withdrawal successful");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  };

  getCampaignProgress = async (userAddr: string, campaignId: number) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_campaign_progress`,
          typeArguments: [],
          functionArguments: [userAddr, campaignId.toString()],
        },
      });
      return result as [number, number]; // [current_balance, goal]
    } catch (error) {
      console.error("Error getting campaign progress:", error);
      throw error;
    }
  };

  storeExists = async (userAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::store_exists`,
          typeArguments: [],
          functionArguments: [userAddr],
        },
      });
      return result[0] as boolean;
    } catch (error) {
      console.error("Error checking store exists:", error);
      throw error;
    }
  };

  getAllCampaigns = async (userAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_all_campaigns`,
          typeArguments: [],
          functionArguments: [userAddr],
        },
      });
      return (result[0] as any[]).map((campaign: any) => ({
        id: campaign.id,
        campaign_type: campaign.campaign_type,
        name: campaign.name,
        description: campaign.description,
        goal: campaign.goal,
        price: campaign.price,
        image: campaign.image,
        is_active: campaign.is_active,
        created_by: campaign.created_by,
        created_at: (() => {
          const ts = Number(campaign.created_at);
          return new Date(ts > 1e12 ? ts / 1000 : ts * 1000).toISOString();
        })(),
        updated_at: (() => {
          const ts = Number(campaign.updated_at);
          return new Date(ts > 1e12 ? ts / 1000 : ts * 1000).toISOString();
        })(),
      }));
    } catch (error) {
      console.error("Error getting all campaigns:", error);
      throw error;
    }
  };

  getTotalBalance = async (userAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_total_balance`,
          typeArguments: [],
          functionArguments: [userAddr],
        },
      });
      return result[0] as number;
    } catch (error) {
      console.error("Error getting total balance:", error);
      throw error;
    }
  };

  getAllSupporters = async (userAddr: string) => {
    try {
      //@ts-ignore
      const result = await this.aptos.view({
        payload: {
          function: `${this.CONTRACT_ADDRESS}::${this.MODULE}::get_all_supporters`,
          typeArguments: [],
          functionArguments: [userAddr],
        },
      });
      return result[0] as string[];
    } catch (error) {
      console.error("Error getting all supporters:", error);
      throw error;
    }
  };
}

export const contractService = new ContractService();
