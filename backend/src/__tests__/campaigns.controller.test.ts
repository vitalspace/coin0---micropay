import { describe, test, expect, beforeEach, mock } from "bun:test";
import { createCampaign } from "../controllers/campaigns.controller";
import User from "../models/user.model";
import Campaign from "../models/campaigns.model";
import { mockUserFindById, mockCampaignSave, mockCampaignConstructor, resetMocks, setUserFound, setCampaignSaveSuccess } from "./mocks";

// Mock the models
mock.module("../models/user.model", () => ({
  default: {
    findById: mockUserFindById,
  },
}));

mock.module("../models/campaigns.model", () => ({
  default: class MockCampaign {
    _id: string;
    save: () => Promise<any>;

    constructor(data: any) {
      Object.assign(this, data);
      this._id = "507f1f77bcf86cd799439012";
      this.save = mockCampaignSave;
    }
  } as any,
}));

describe("Campaigns Controller", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetMocks();
  });

  describe("createCampaign", () => {
    const mockContext = {
      body: {} as any,
      set: { status: 200 },
    };

    test("should create a donation campaign successfully", async () => {
      const campaignData = {
        type: "donation" as const,
        name: "Test Donation Campaign",
        description: "A test donation campaign",
        goal: 1000,
        image: "https://example.com/image.jpg",
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = campaignData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Campaign created successfully",
        campaign: expect.objectContaining({
          type: "donation",
          name: "Test Donation Campaign",
          description: "A test donation campaign",
          goal: 1000,
          price: undefined,
          isActive: true,
          createdBy: "507f1f77bcf86cd799439011",
        }),
      });
      expect(mockContext.set.status).toBe(201);
    });

    test("should create a business campaign successfully", async () => {
      const campaignData = {
        type: "business" as const,
        name: "Test Business Campaign",
        description: "A test business campaign",
        price: 100,
        image: "https://example.com/image.jpg",
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = campaignData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Campaign created successfully",
        campaign: expect.objectContaining({
          type: "business",
          name: "Test Business Campaign",
          description: "A test business campaign",
          goal: undefined,
          price: 100,
          isActive: true,
          createdBy: "507f1f77bcf86cd799439011",
        }),
      });
      expect(mockContext.set.status).toBe(201);
    });

    test("should create a business campaign with different price successfully", async () => {
      const campaignData = {
        type: "business" as const,
        name: "Test Business Campaign with Higher Price",
        description: "A test business campaign with different pricing",
        price: 250,
        image: "https://example.com/image.jpg",
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = campaignData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Campaign created successfully",
        campaign: expect.objectContaining({
          type: "business",
          name: "Test Business Campaign with Higher Price",
          description: "A test business campaign with different pricing",
          goal: undefined,
          price: 250,
          isActive: true,
          createdBy: "507f1f77bcf86cd799439011",
        }),
      });
      expect(mockContext.set.status).toBe(201);
    });

    test("should create a product campaign successfully", async () => {
      const campaignData = {
        type: "product" as const,
        name: "Test Product Campaign",
        description: "A test product campaign",
        price: 50,
        image: "https://example.com/image.jpg",
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = campaignData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Campaign created successfully",
        campaign: expect.objectContaining({
          type: "product",
          name: "Test Product Campaign",
          description: "A test product campaign",
          goal: undefined,
          price: 50,
          isActive: true,
          createdBy: "507f1f77bcf86cd799439011",
        }),
      });
      expect(mockContext.set.status).toBe(201);
    });

    test("should return 400 for missing required fields", async () => {
      const incompleteData = {
        type: "donation" as const,
        name: "Test Campaign",
        // Missing description and createdBy
      };

      mockContext.body = incompleteData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Missing required fields",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 400 for invalid campaign type", async () => {
      const invalidData = {
        type: "invalid_type" as any,
        name: "Test Campaign",
        description: "A test campaign",
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = invalidData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Invalid campaign type",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 404 when user is not found", async () => {
      // Set user to not be found
      setUserFound(false);

      const campaignData = {
        type: "donation" as const,
        name: "Test Campaign",
        description: "A test campaign",
        goal: 1000,
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = campaignData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "User not found",
      });
      expect(mockContext.set.status).toBe(404);
    });

    test("should return 500 for database errors", async () => {
      // Set campaign save to fail
      setCampaignSaveSuccess(false, new Error("Database connection failed"));

      const campaignData = {
        type: "donation" as const,
        name: "Test Campaign",
        description: "A test campaign",
        goal: 1000,
        createdBy: "507f1f77bcf86cd799439011",
      };

      mockContext.body = campaignData;

      const result = await createCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Internal server error",
        error: expect.any(Error),
      });
      expect(mockContext.set.status).toBe(500);
    });
  });
});