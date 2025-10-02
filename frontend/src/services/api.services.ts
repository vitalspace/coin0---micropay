import axios from "@services/axios";

// User APIs
export const profile = async (body: any) => await axios.post("/api/v1/profile", body);

export const createUser = async (body: any) =>
  await axios.post("/api/v1/create-user", body);

export const updateProfile = async (body: any) =>
  await axios.put("/api/v1/update-profile", body);

// Campaign APIs
export const createCampaign = async (body: any) => {
  await axios.post("/api/v1/create-campaign", body);
};

export const createMemo = async (body: any) => {
  await axios.post("/api/v1/create-memo", body);
};

export const getCampaignById = async (id: string, userId?: string) => {
  const params = userId ? { userId } : {};
  return await axios.get(`/api/v1/campaign/${id}`, { params });
};

export const getUserCampaigns = async (
  address: string,
  params?: {
    page?: number;
    limit?: number;
    type?: 'donation' | 'business' | 'product';
    isActive?: boolean;
  }
) => {
  return await axios.get('/api/v1/user/campaigns', {
    params: { address, ...params }
  });
};

export const getAllCampaigns = async (
  params?: {
    page?: number;
    limit?: number;
    type?: 'donation' | 'business' | 'product';
    isActive?: boolean;
  }
) => {
  return await axios.get('/api/v1/campaigns', { params });
};

export const getCampaignByContractId = async (
  contractId: number,
  creatorAddress: string
) => {
  return await axios.get('/api/v1/campaign-contract', {
    params: { contractId: contractId.toString(), creatorAddress }
  });
};

export const getCampaignMemos = async (
  campaignId: string,
  params?: {
    page?: number;
    limit?: number;
  }
) => {
  const response = await axios.get(`/api/v1/campaign/${campaignId}/memos`, { params });
  return response.data;
};

/**
 * Improves a campaign's title or description using AI based on provided context.
 * @param body - The request body containing campaign details.
 * @param body.campaignId - The ID of the campaign to improve (optional for new campaigns).
 * @param body.field - The field to improve ('name' for title or 'description').
 * @param body.context - Additional context for the AI to improve the field.
 * @param body.currentValue - The current value of the field (required if campaignId not provided).
 * @returns Promise resolving to the improved text.
 */
export const improveCampaign = async (body: {
  campaignId?: string;
  field: 'name' | 'description';
  context: string;
  currentValue?: string;
}) => {
  return await axios.post('/api/v1/improve-campaign', body);
};
