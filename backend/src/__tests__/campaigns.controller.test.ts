import { describe, test, expect, beforeEach, mock } from "bun:test";
import { createCampaign, createMemo, getCampaignById, getUserCampaigns, getAllCampaigns, improveCampaign } from "../controllers/campaigns.controller";
import User from "../models/user.model";
import Campaign, { Memo } from "../models/campaigns.model";
import { mockUserFindById, mockCampaignSave, mockCampaignConstructor, mockMemoSave, mockMemoConstructor, mockCampaignFindById, mockMemoFindOne, mockCampaignFind, mockCampaignCountDocuments, mockCampaignData, mockUserData, resetMocks, setUserFound, setCampaignSaveSuccess, setMemoSaveSuccess, setMemoExists, setCampaignFound } from "./mocks";

// Mock the models
mock.module("../models/user.model", () => ({
  default: {
    findById: mockUserFindById,
    findOne: (query: any) => {
      if (query.address === "0x123456789abcdef") {
        return Promise.resolve(mockUserData);
      }
      return Promise.resolve(null);
    },
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

    static findById = mockCampaignFindById;
    static find = mockCampaignFind;
    static countDocuments = mockCampaignCountDocuments;
  } as any,

  Memo: class MockMemo {
    _id: string;
    save: () => Promise<any>;

    constructor(data: any) {
      Object.assign(this, data);
      this._id = "507f1f77bcf86cd799439013";
      this.save = mockMemoSave;
    }

    static findOne = mockMemoFindOne;
  } as any,
}));

// Mock Cerebras SDK
mock.module("@cerebras/cerebras_cloud_sdk", () => ({
  default: class MockCerebras {
    constructor() {}

    chat = {
      completions: {
        create: () => {
          return {
            [Symbol.asyncIterator]: async function* () {
              yield { choices: [{ delta: { content: "Improved text" } }] };
            }
          };
        }
      }
    };
  }
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
        createdBy: "0x123456789abcdef",
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
        createdBy: "0x123456789abcdef",
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
        createdBy: "0x123456789abcdef",
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
        createdBy: "0x123456789abcdef",
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
        createdBy: "0x123456789abcdef",
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

  describe("createMemo", () => {
    const mockContext = {
      body: {} as any,
      set: { status: 200 },
    };

    test("should create a memo successfully", async () => {
      const memoData = {
        transaction_hash: "0xabc123def456",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x123456789abcdef",
        memo: "Thank you for your support!",
        type: "donation" as const,
      };

      mockContext.body = memoData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Memo created successfully",
        memo: expect.objectContaining({
          transaction_hash: "0xabc123def456",
          campaign_id: "507f1f77bcf86cd799439012",
          user_address: "0x123456789abcdef",
          memo: "Thank you for your support!",
          type: "donation",
        }),
      });
      expect(mockContext.set.status).toBe(201);
    });

    test("should create a purchase memo successfully", async () => {
      const memoData = {
        transaction_hash: "0xdef789ghi012",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x987654321fedcba",
        memo: "Excited to use this product!",
        type: "purchase" as const,
      };

      mockContext.body = memoData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Memo created successfully",
        memo: expect.objectContaining({
          transaction_hash: "0xdef789ghi012",
          campaign_id: "507f1f77bcf86cd799439012",
          user_address: "0x987654321fedcba",
          memo: "Excited to use this product!",
          type: "purchase",
        }),
      });
      expect(mockContext.set.status).toBe(201);
    });

    test("should return 400 for missing required fields", async () => {
      const incompleteData = {
        transaction_hash: "0xabc123def456",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x123456789abcdef",
        // Missing memo and type
      };

      mockContext.body = incompleteData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Missing required fields",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 400 for invalid memo type", async () => {
      const invalidData = {
        transaction_hash: "0xabc123def456",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x123456789abcdef",
        memo: "Test memo",
        type: "invalid_type" as any,
      };

      mockContext.body = invalidData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Invalid memo type",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 404 when campaign is not found", async () => {
      setCampaignFound(false);

      const memoData = {
        transaction_hash: "0xabc123def456",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x123456789abcdef",
        memo: "Test memo",
        type: "donation" as const,
      };

      mockContext.body = memoData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Campaign not found",
      });
      expect(mockContext.set.status).toBe(404);
    });

    test("should return 409 when memo already exists for transaction", async () => {
      setMemoExists(true);

      const memoData = {
        transaction_hash: "0xabc123def456",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x123456789abcdef",
        memo: "Test memo",
        type: "donation" as const,
      };

      mockContext.body = memoData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Memo already exists for this transaction",
      });
      expect(mockContext.set.status).toBe(409);
    });

    test("should return 500 for database errors", async () => {
      setMemoSaveSuccess(false, new Error("Database connection failed"));

      const memoData = {
        transaction_hash: "0xabc123def456",
        campaign_id: "507f1f77bcf86cd799439012",
        user_address: "0x123456789abcdef",
        memo: "Test memo",
        type: "donation" as const,
      };

      mockContext.body = memoData;

      const result = await createMemo(mockContext as any);

      expect(result).toEqual({
        message: "Internal server error",
        error: expect.any(Error),
      });
      expect(mockContext.set.status).toBe(500);
    });
  });

  describe("getCampaignById", () => {
    const mockContext = {
      params: { id: "507f1f77bcf86cd799439012" },
      query: {},
      set: { status: 200 },
    };

    test("should return campaign successfully", async () => {
      const result = await getCampaignById(mockContext as any);

      expect(result).toEqual({
        campaign: expect.objectContaining({
          _id: "507f1f77bcf86cd799439012",
          type: "donation",
          name: "Test Campaign",
        }),
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should return campaign with user verification", async () => {
      mockContext.query = { userId: "507f1f77bcf86cd799439011" };

      const result = await getCampaignById(mockContext as any);

      expect(result).toEqual({
        campaign: expect.objectContaining({
          _id: "507f1f77bcf86cd799439012",
          type: "donation",
          name: "Test Campaign",
        }),
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should return 400 for missing campaign ID", async () => {
      const contextWithoutId = {
        params: {},
        query: {},
        set: { status: 200 },
      };

      const result = await getCampaignById(contextWithoutId as any);

      expect(result).toEqual({
        message: "Campaign ID is required",
      });
      expect(contextWithoutId.set.status).toBe(400);
    });

    test("should return 404 when campaign is not found", async () => {
      setCampaignFound(false);

      const result = await getCampaignById(mockContext as any);

      expect(result).toEqual({
        message: "Campaign not found",
      });
      expect(mockContext.set.status).toBe(404);
    });

    test("should return 403 when campaign does not belong to user", async () => {
      mockContext.query = { userId: "different_user_id" };

      const result = await getCampaignById(mockContext as any);

      expect(result).toEqual({
        message: "Access denied: Campaign does not belong to this user",
      });
      expect(mockContext.set.status).toBe(403);
    });
  });

  describe("getUserCampaigns", () => {
    const mockContext = {
      params: { userId: "507f1f77bcf86cd799439011" },
      query: {},
      set: { status: 200 },
    };

    test("should return user campaigns with default pagination", async () => {
      const result = await getUserCampaigns(mockContext as any);

      expect(result).toEqual({
        campaigns: [expect.objectContaining({
          _id: "507f1f77bcf86cd799439012",
          type: "donation",
          name: "Test Campaign",
        })],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNext: false,
          hasPrev: false,
        },
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should return user campaigns with custom pagination", async () => {
      mockContext.query = { page: "2", limit: "5" };

      const result = await getUserCampaigns(mockContext as any);

      expect(result).toEqual({
        campaigns: [expect.objectContaining({
          _id: "507f1f77bcf86cd799439012",
          type: "donation",
          name: "Test Campaign",
        })],
        pagination: {
          currentPage: 2,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 5,
          hasNext: false,
          hasPrev: true,
        },
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should filter campaigns by type", async () => {
      mockContext.query = { type: "donation" };

      const result = await getUserCampaigns(mockContext as any);

      expect(result.campaigns).toEqual([expect.objectContaining({
        _id: "507f1f77bcf86cd799439012",
        type: "donation",
        name: "Test Campaign",
      })]);
      expect(mockContext.set.status).toBe(200);
    });

    test("should filter campaigns by active status", async () => {
      mockContext.query = { isActive: "true" };

      const result = await getUserCampaigns(mockContext as any);

      expect(result.campaigns).toEqual([expect.objectContaining({
        _id: "507f1f77bcf86cd799439012",
        type: "donation",
        name: "Test Campaign",
      })]);
      expect(mockContext.set.status).toBe(200);
    });

    test("should return 400 for missing user ID", async () => {
      const contextWithoutUserId = {
        params: {},
        query: {},
        set: { status: 200 },
      };

      const result = await getUserCampaigns(contextWithoutUserId as any);

      expect(result).toEqual({
        message: "User ID is required",
      });
      expect(contextWithoutUserId.set.status).toBe(400);
    });

    test("should return 400 for invalid pagination parameters", async () => {
      mockContext.query = { page: "0", limit: "150" };

      const result = await getUserCampaigns(mockContext as any);

      expect(result).toEqual({
        message: "Invalid pagination parameters",
      });
      expect(mockContext.set.status).toBe(400);
    });
  });

  describe("getAllCampaigns", () => {
    const mockContext = {
      query: {},
      set: { status: 200 },
    };

    test("should return all campaigns with default pagination", async () => {
      const result = await getAllCampaigns(mockContext as any);

      expect(result).toEqual({
        campaigns: [expect.objectContaining({
          _id: "507f1f77bcf86cd799439012",
          type: "donation",
          name: "Test Campaign",
        })],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasNext: false,
          hasPrev: false,
        },
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should return all campaigns with custom pagination", async () => {
      mockContext.query = { page: "2", limit: "5" };

      const result = await getAllCampaigns(mockContext as any);

      expect(result).toEqual({
        campaigns: [expect.objectContaining({
          _id: "507f1f77bcf86cd799439012",
          type: "donation",
          name: "Test Campaign",
        })],
        pagination: {
          currentPage: 2,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 5,
          hasNext: false,
          hasPrev: true,
        },
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should filter all campaigns by type", async () => {
      mockContext.query = { type: "donation" };

      const result = await getAllCampaigns(mockContext as any);

      expect(result.campaigns).toEqual([expect.objectContaining({
        _id: "507f1f77bcf86cd799439012",
        type: "donation",
        name: "Test Campaign",
      })]);
      expect(mockContext.set.status).toBe(200);
    });

    test("should filter all campaigns by active status", async () => {
      mockContext.query = { isActive: "true" };

      const result = await getAllCampaigns(mockContext as any);

      expect(result.campaigns).toEqual([expect.objectContaining({
        _id: "507f1f77bcf86cd799439012",
        type: "donation",
        name: "Test Campaign",
      })]);
      expect(mockContext.set.status).toBe(200);
    });

    test("should return 400 for invalid pagination parameters", async () => {
      mockContext.query = { page: "0", limit: "150" };

      const result = await getAllCampaigns(mockContext as any);

      expect(result).toEqual({
        message: "Invalid pagination parameters",
      });
      expect(mockContext.set.status).toBe(400);
    });
  });

  describe("improveCampaign", () => {
    const mockContext = {
      body: {} as any,
      set: { status: 200 },
    };

    test("should improve campaign name successfully", async () => {
      const improveData = {
        campaignId: "507f1f77bcf86cd799439012",
        field: "name" as const,
        context: "Make it more engaging for donations",
      };

      mockContext.body = improveData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        improvedText: "Improved text",
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should improve campaign description successfully", async () => {
      const improveData = {
        campaignId: "507f1f77bcf86cd799439012",
        field: "description" as const,
        context: "Add more details about the cause",
      };

      mockContext.body = improveData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        improvedText: "Improved text",
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should improve text without campaignId", async () => {
      const improveData = {
        field: "name" as const,
        context: "Make it more engaging",
        currentValue: "Original name",
      };

      mockContext.body = improveData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        improvedText: "Improved text",
      });
      expect(mockContext.set.status).toBe(200);
    });

    test("should return 400 for missing required fields", async () => {
      const incompleteData = {
        field: "name" as const,
        // Missing context
      };

      mockContext.body = incompleteData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Missing required fields: field, context",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 400 for invalid field", async () => {
      const invalidData = {
        field: "invalid_field" as any,
        context: "Some context",
      };

      mockContext.body = invalidData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Invalid field. Must be 'name' or 'description'",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 400 when currentValue is missing for new campaigns", async () => {
      const invalidData = {
        field: "name" as const,
        context: "Some context",
        // Missing currentValue
      };

      mockContext.body = invalidData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        message: "currentValue is required when campaignId is not provided",
      });
      expect(mockContext.set.status).toBe(400);
    });

    test("should return 404 when campaign is not found", async () => {
      setCampaignFound(false);

      const improveData = {
        campaignId: "507f1f77bcf86cd799439012",
        field: "name" as const,
        context: "Make it better",
      };

      mockContext.body = improveData;

      const result = await improveCampaign(mockContext as any);

      expect(result).toEqual({
        message: "Campaign not found",
      });
      expect(mockContext.set.status).toBe(404);
    });
  });
});