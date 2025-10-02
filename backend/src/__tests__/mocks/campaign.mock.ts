export const mockCampaign = {
  _id: "507f1f77bcf86cd799439012",
  type: "donation",
  name: "Test Campaign",
  description: "A test campaign for testing purposes",
  goal: 1000,
  price: undefined,
  image: "https://example.com/campaign.jpg",
  isActive: true,
  createdBy: "507f1f77bcf86cd799439011",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCampaignDoc = {
  ...mockCampaign,
  save: () => Promise.resolve(mockCampaign),
};

export const createMockCampaign = (overrides = {}) => ({
  ...mockCampaign,
  ...overrides,
});

export const createDonationCampaign = (overrides = {}) => ({
  ...mockCampaign,
  type: "donation",
  goal: 1000,
  price: undefined,
  ...overrides,
});

export const createBusinessCampaign = (overrides = {}) => ({
  ...mockCampaign,
  type: "business",
  goal: undefined,
  price: undefined,
  ...overrides,
});

export const createProductCampaign = (overrides = {}) => ({
  ...mockCampaign,
  type: "product",
  goal: undefined,
  price: 50,
  ...overrides,
});