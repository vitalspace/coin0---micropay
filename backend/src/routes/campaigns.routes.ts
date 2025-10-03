import { Elysia, t } from "elysia";
import {
  createCampaign,
  createMemo,
  getCampaignById,
  getUserCampaigns,
  getAllCampaigns,
  getCampaignByContractId,
  getCampaignMemos,
  createMessage,
  getUserMessages,
  getConversation,
  improveCampaign,
} from "../controllers/campaigns.controller";

export const campaignRoutes = new Elysia({
  detail: {
    tags: ["Campaigns"],
  },
})
  .post("/api/v1/create-campaign", createCampaign, {
    body: t.Object({
      type: t.Union([
        t.Literal("donation"),
        t.Literal("business"),
        t.Literal("product"),
      ]),
      name: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      description: t.String({
        minLength: 1,
        maxLength: 256,
      }),
      contractId: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      transaction_hash: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      goal: t.Optional(t.Number()),
      price: t.Optional(t.Number()),
      image: t.Optional(t.String()),
      createdBy: t.String({
        minLength: 1, // Wallet address
      }),
    }),
  })
  .post("/api/v1/create-memo", createMemo, {
    body: t.Object({
      contractId: t.Number(),
      creator_address: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      memo: t.String({
        minLength: 1,
        maxLength: 1000,
      }),
      transaction_hash: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      type: t.Union([t.Literal("donation"), t.Literal("purchase")]),
      user_address: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      amount: t.Number(),
    }),
  })
  .get("/api/v1/campaign/:id", getCampaignById, {
    params: t.Object({
      id: t.String({
        minLength: 24, // MongoDB ObjectId length
      }),
    }),
    query: t.Object({
      userId: t.Optional(
        t.String({
          minLength: 24,
        })
      ),
    }),
  })
  .get("/api/v1/user/campaigns", getUserCampaigns, {
    query: t.Object({
      address: t.String({
        minLength: 1,
      }),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      type: t.Optional(
        t.Union([
          t.Literal("donation"),
          t.Literal("business"),
          t.Literal("product"),
        ])
      ),
      isActive: t.Optional(t.Union([t.Literal("true"), t.Literal("false")])),
    }),
  })
  .get("/api/v1/campaigns", getAllCampaigns, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      type: t.Optional(
        t.Union([
          t.Literal("donation"),
          t.Literal("business"),
          t.Literal("product"),
        ])
      ),
      isActive: t.Optional(t.Union([t.Literal("true"), t.Literal("false")])),
    }),
  })
  .get("/api/v1/campaign-contract", getCampaignByContractId, {
    query: t.Object({
      contractId: t.String(),
      creatorAddress: t.String(),
    }),
  })
  .get("/api/v1/campaign/:id/memos", getCampaignMemos, {
    params: t.Object({
      id: t.String({
        minLength: 24, // MongoDB ObjectId length
      }),
    }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })
  .post("/api/v1/messages", createMessage, {
    body: t.Object({
      sender_address: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      receiver_address: t.String({
        minLength: 1,
        maxLength: 100,
      }),
      campaign_id: t.Optional(t.Number()),
      message: t.String({
        minLength: 1,
        maxLength: 1000,
      }),
      subject: t.Optional(t.String()),
    }),
  })
  .get("/api/v1/messages/user", getUserMessages, {
    query: t.Object({
      address: t.String({
        minLength: 1,
      }),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })
  .get("/api/v1/messages/conversation/:userAddress/:otherAddress", getConversation, {
    params: t.Object({
      userAddress: t.String({
        minLength: 1,
      }),
      otherAddress: t.String({
        minLength: 1,
      }),
    }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      campaign_id: t.Optional(t.String()),
    }),
  })
  .post("/api/v1/improve-campaign", improveCampaign, {
    body: t.Object({
      campaignId: t.Optional(
        t.String({
          minLength: 24, // MongoDB ObjectId length
        })
      ),
      field: t.Union([t.Literal("name"), t.Literal("description")]),
      context: t.String({
        minLength: 1,
      }),
      currentValue: t.Optional(t.String()),
    }),
  });
