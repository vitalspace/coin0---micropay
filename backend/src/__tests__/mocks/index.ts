// Mock data for testing
export const mockUserData = {
  _id: "507f1f77bcf86cd799439011",
  address: "0x123456789abcdef",
  avatar: "https://example.com/avatar.jpg",
  nickname: "testuser",
};

export const mockCampaignData = {
  _id: "507f1f77bcf86cd799439012",
  type: "donation",
  name: "Test Campaign",
  description: "A test campaign",
  goal: 1000,
  isActive: true,
  createdBy: "507f1f77bcf86cd799439011",
};

export const mockMemoData = {
  _id: "507f1f77bcf86cd799439013",
  transaction_hash: "0xabc123def456",
  campaign_id: "507f1f77bcf86cd799439012",
  user_address: "0x123456789abcdef",
  memo: "Thank you for your support!",
  type: "donation",
};

// Test control variables
let shouldUserBeFound = true;
let shouldCampaignSaveSucceed = true;
let campaignSaveError: Error | null = null;
let shouldMemoSaveSucceed = true;
let memoSaveError: Error | null = null;
let shouldMemoExist = false;
let shouldCampaignBeFound = true;

// Mock functions that can be controlled in tests
export const mockUserFindById = (id: string) => {
  if (shouldUserBeFound && id === "507f1f77bcf86cd799439011") {
    return Promise.resolve(mockUserData);
  }
  return Promise.resolve(null);
};

export const mockCampaignSave = () => {
  if (!shouldCampaignSaveSucceed && campaignSaveError) {
    return Promise.reject(campaignSaveError);
  }
  return Promise.resolve(mockCampaignData);
};

export const mockCampaignConstructor = (data: any) => ({
  ...data,
  _id: "507f1f77bcf86cd799439012",
  save: mockCampaignSave,
});

export const mockMemoSave = () => {
  if (!shouldMemoSaveSucceed && memoSaveError) {
    return Promise.reject(memoSaveError);
  }
  return Promise.resolve(mockMemoData);
};

export const mockMemoConstructor = (data: any) => ({
  ...data,
  _id: "507f1f77bcf86cd799439013",
  save: mockMemoSave,
});

export const mockCampaignFindById = (id: string) => {
  if (shouldCampaignBeFound && id === "507f1f77bcf86cd799439012") {
    return Promise.resolve(mockCampaignData);
  }
  return Promise.resolve(null);
};

export const mockMemoFindOne = (query: any) => {
  if (shouldMemoExist && query.transaction_hash === "0xabc123def456") {
    return Promise.resolve(mockMemoData);
  }
  return Promise.resolve(null);
};

export const mockCampaignFind = (filter: any) => {
  return {
    sort: () => ({
      skip: () => ({
        limit: () => ({
          populate: () => Promise.resolve([mockCampaignData])
        })
      })
    })
  };
};

export const mockCampaignCountDocuments = (filter: any) => {
  return Promise.resolve(1);
};

// Test control functions
export const setUserFound = (found: boolean) => {
  shouldUserBeFound = found;
};

export const setCampaignSaveSuccess = (success: boolean, error?: Error) => {
  shouldCampaignSaveSucceed = success;
  campaignSaveError = error || null;
};

export const setMemoSaveSuccess = (success: boolean, error?: Error) => {
  shouldMemoSaveSucceed = success;
  memoSaveError = error || null;
};

export const setMemoExists = (exists: boolean) => {
  shouldMemoExist = exists;
};

export const setCampaignFound = (found: boolean) => {
  shouldCampaignBeFound = found;
};

// Reset function for testing
export const resetMocks = () => {
  shouldUserBeFound = true;
  shouldCampaignSaveSucceed = true;
  campaignSaveError = null;
  shouldMemoSaveSucceed = true;
  memoSaveError = null;
  shouldMemoExist = false;
  shouldCampaignBeFound = true;
};