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

// Test control variables
let shouldUserBeFound = true;
let shouldCampaignSaveSucceed = true;
let campaignSaveError: Error | null = null;

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

// Test control functions
export const setUserFound = (found: boolean) => {
  shouldUserBeFound = found;
};

export const setCampaignSaveSuccess = (success: boolean, error?: Error) => {
  shouldCampaignSaveSucceed = success;
  campaignSaveError = error || null;
};

// Reset function for testing
export const resetMocks = () => {
  shouldUserBeFound = true;
  shouldCampaignSaveSucceed = true;
  campaignSaveError = null;
};