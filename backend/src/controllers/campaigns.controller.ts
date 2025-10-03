import { Context } from "elysia";
import { ObjectId } from "mongoose";
import Campaign, { Memo, Conversation, Message } from "../models/campaigns.model";
import User from "../models/user.model";
import { ICampaignData, IMemoData, IMessageData } from "../types/types";
import Cerebras from "@cerebras/cerebras_cloud_sdk";

export const createCampaign = async (ctx: Context) => {
  try {
    const {
      type,
      name,
      description,
      goal,
      price,
      image,
      contractId,
      transaction_hash,
      createdBy,
    } = ctx.body as ICampaignData & {
      contractId?: number;
      transaction_hash?: string;
    };

    if (!type || !name || !description || !createdBy) {
      ctx.set.status = 400;
      return { message: "Missing required fields" };
    }

    if (!["donation", "business", "product"].includes(type)) {
      ctx.set.status = 400;
      return { message: "Invalid campaign type" };
    }

    const user = await User.findOne({ address: createdBy });
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    // If contractId not provided, assign the next available
    let finalContractId = contractId;
    if (!finalContractId) {
      const lastCampaign = await Campaign.findOne({ createdBy: user._id }).sort(
        { contractId: -1 }
      );
      finalContractId = (lastCampaign?.contractId || 0) + 1;
    }

    const campaign = new Campaign({
      type,
      name,
      description,
      goal: type === "donation" ? goal : undefined,
      price: type === "product" || type === "business" ? price : undefined,
      image,
      contractId: finalContractId,
      transaction_hash,
      isActive: true,
      createdBy: user._id as ObjectId,
    });

    await campaign.save();
    ctx.set.status = 201;

    return { message: "Campaign created successfully", campaign };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getCampaignById = async (ctx: Context) => {
  try {
    const { id } = ctx.params as { id: string };
    const { userId } = ctx.query as { userId?: string };

    if (!id) {
      ctx.set.status = 400;
      return { message: "Campaign ID is required" };
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      ctx.set.status = 404;
      return { message: "Campaign not found" };
    }

    // If userId is provided, verify the campaign belongs to that user
    if (userId && campaign.createdBy.toString() !== userId) {
      ctx.set.status = 403;
      return {
        message: "Access denied: Campaign does not belong to this user",
      };
    }

    return { campaign };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getAllCampaigns = async (ctx: Context) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      isActive,
    } = ctx.query as {
      page?: string;
      limit?: string;
      type?: string;
      isActive?: string;
    };

    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      ctx.set.status = 400;
      return { message: "Invalid pagination parameters" };
    }

    // Build filter
    const filter: any = {};

    if (type && ["donation", "business", "product"].includes(type)) {
      filter.type = type;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (pageNum - 1) * limitNum;

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "nickname avatar address"),
      Campaign.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return {
      campaigns,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getUserCampaigns = async (ctx: Context) => {
  try {
    const { address } = ctx.query as { address: string };
    const {
      page = 1,
      limit = 10,
      type,
      isActive,
    } = ctx.query as {
      address: string;
      page?: string;
      limit?: string;
      type?: string;
      isActive?: string;
    };

    if (!address) {
      ctx.set.status = 400;
      return { message: "User address is required" };
    }

    // Find user by address
    const user = await User.findOne({ address });
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      ctx.set.status = 400;
      return { message: "Invalid pagination parameters" };
    }

    // Build filter
    const filter: any = { createdBy: user._id };

    if (type && ["donation", "business", "product"].includes(type)) {
      filter.type = type;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const skip = (pageNum - 1) * limitNum;

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "nickname avatar address"),
      Campaign.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return {
      campaigns,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getCampaignByContractId = async (ctx: Context) => {
  try {
    const { contractId, creatorAddress } = ctx.query as {
      contractId?: string;
      creatorAddress?: string;
    };

    if (!contractId || !creatorAddress) {
      ctx.set.status = 400;
      return { message: "contractId and creatorAddress are required" };
    }

    const contractIdNum = parseInt(contractId, 10);
    if (isNaN(contractIdNum)) {
      ctx.set.status = 400;
      return { message: "Invalid contractId" };
    }

    // Find user by address
    let user = await User.findOne({ address: creatorAddress });

    if (!user) {
      // For debugging: try to find campaigns that might exist without a user
      const allCampaigns = await Campaign.find({}).limit(5);

      // Try to find campaigns by contractId only (ignore user for now)
      let campaign = await Campaign.findOne({ contractId: contractIdNum });
      if (campaign) {
        return { campaign };
      }

      // Try to find any campaigns (for debugging)
      if (allCampaigns.length > 0) {
        return { campaign: allCampaigns[0] };
      }

      ctx.set.status = 404;
      return { message: `User not found with address: ${creatorAddress}` };
    }

    // First try to find campaign by contractId and createdBy
    let campaign = await Campaign.findOne({
      contractId: contractIdNum,
      createdBy: user._id,
    });

    // If not found, try to find campaigns by creator and assume the contractId (for backward compatibility)
    if (!campaign) {
      const campaigns = await Campaign.find({ createdBy: user._id }).sort({
        createdAt: 1,
      });

      if (campaigns.length > 0) {
        // Assume the first (most recent) campaign corresponds to contractId 1, second to 2, etc.
        // This is a simple heuristic for existing campaigns
        const campaignIndex = contractIdNum - 1;

        if (campaignIndex >= 0 && campaignIndex < campaigns.length) {
          campaign = campaigns[campaignIndex];
        } else {
          // Index out of bounds - for backward compatibility, assume this is the most recent campaign
          campaign = campaigns[0]; // Most recent (sorted by createdAt desc)
        }

        // Update the campaign with contractId for future use
        if (!campaign.contractId) {
          campaign.contractId = contractIdNum;
          await campaign.save();
        }
      }
    }

    if (!campaign) {
      ctx.set.status = 404;
      return { message: "Campaign not found" };
    }

    return { campaign };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const createMemo = async (ctx: Context) => {
  try {
    const {
      contractId,
      creator_address,
      memo,
      transaction_hash,
      type,
      user_address,
      amount,
    } = ctx.body as IMemoData;


    if (
      !contractId ||
      !creator_address ||
      !memo ||
      !transaction_hash ||
      !user_address ||
      !type ||
      amount === undefined
    ) {
      ctx.set.status = 400;
      return { message: "Missing required fields" };
    }

    if (!["donation", "purchase"].includes(type)) {
      ctx.set.status = 400;
      return { message: "Invalid memo type" };
    }

    const user = await User.findOne({ address: creator_address });

    if (!user) {
      ctx.set.status = 404;
      return { message: "Creator user not found" };
    }

    const campaign = await Campaign.findOne({
      contractId,
      createdBy: user._id,
    });
    if (!campaign) {
      ctx.set.status = 404;
      return { message: "Campaign not found for this creator" };
    }

    const existingMemo = await Memo.findOne({ transaction_hash });
    if (existingMemo) {
      ctx.set.status = 409;
      return { message: "Memo with this transaction_hash already exists" };
    }

    // Check if this user has already supported this campaign
    const existingSupporter = await Memo.findOne({
      campaign_id: campaign.contractId,
      user_address,
    });

    const newMemo = new Memo({
      campaign_id: Number(campaign.contractId),
      creator_address,
      memo,
      transaction_hash,
      type,
      user_address,
      amount,
    });
    await newMemo.save();

    // Update campaign stats
    const amountInApt = amount / 100000000; // Convert octas to APT
    campaign.totalRaised += amountInApt;

    // Only increment supporterCount if this is the first support from this user
    if (!existingSupporter) {
      campaign.supporterCount += 1;
    }

    await campaign.save();

    ctx.set.status = 201;
    return { message: "Memo created successfully", memo: newMemo };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getCampaignMemos = async (ctx: Context) => {



  try {
    const { id } = ctx.params as { id: string };
    const { page = 1, limit = 10 } = ctx.query as {
      page?: string;
      limit?: string;
    };

    if (!id) {
      ctx.set.status = 400;
      return { message: "Campaign ID is required" };
    }

    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      ctx.set.status = 400;
      return { message: "Invalid pagination parameters" };
    }

    // Verify campaign exists
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      ctx.set.status = 404;
      return { message: "Campaign not found" };
    }

    const skip = (pageNum - 1) * limitNum;

    const [memos, total] = await Promise.all([
      Memo.find({ campaign_id: campaign.contractId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Memo.countDocuments({ campaign_id: campaign.contractId }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return {
      memos,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const createMessage = async (ctx: Context) => {
  try {
    const {
      sender_address,
      receiver_address,
      campaign_id,
      message,
      subject,
    } = ctx.body as IMessageData;

    if (!sender_address || !receiver_address || !message) {
      ctx.set.status = 400;
      return { message: "Missing required fields" };
    }

    if (message.length > 1000) {
      ctx.set.status = 400;
      return { message: "Message too long (max 1000 characters)" };
    }

    // Verify sender exists
    const sender = await User.findOne({ address: sender_address });
    if (!sender) {
      ctx.set.status = 404;
      return { message: "Sender not found" };
    }

    // Verify receiver exists
    const receiver = await User.findOne({ address: receiver_address });
    if (!receiver) {
      ctx.set.status = 404;
      return { message: "Receiver not found" };
    }

    // If campaign_id is provided, verify campaign exists
    if (campaign_id) {
      const campaign = await Campaign.findOne({ contractId: campaign_id });
      if (!campaign) {
        ctx.set.status = 404;
        return { message: "Campaign not found" };
      }
    }

    // Sort participants to ensure consistency
    const participants = [sender_address, receiver_address].sort();

    // Find or create conversation (per campaign)
    let conversation = await Conversation.findOne({
      participants,
      campaign_id: campaign_id || null
    });

    if (!conversation) {
      conversation = new Conversation({
        participants,
        campaign_id: campaign_id || null,
        messages: [],
        lastMessageAt: new Date(),
      });
    }

    // Add message to conversation
    const newMessage = {
      sender_address,
      receiver_address,
      message,
      subject,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRead: false,
      campaign_id,
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageAt = new Date();

    await conversation.save();

    ctx.set.status = 201;
    return { message: "Message sent successfully", data: newMessage };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getUserMessages = async (ctx: Context) => {
  try {
    const { address } = ctx.query as { address: string };
    const {
      page = 1,
      limit = 10,
    } = ctx.query as {
      address: string;
      page?: string;
      limit?: string;
    };

    if (!address) {
      ctx.set.status = 400;
      return { message: "User address is required" };
    }

    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      ctx.set.status = 400;
      return { message: "Invalid pagination parameters" };
    }

    const skip = (pageNum - 1) * limitNum;

    // Get all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: address,
    }).sort({ lastMessageAt: -1 });

    // Flatten all messages from conversations
    let allMessages: any[] = [];
    conversations.forEach(conv => {
      allMessages.push(...conv.messages.map(msg => ({
        _id: (msg as any)._id,
        sender_address: msg.sender_address,
        receiver_address: msg.receiver_address,
        message: msg.message,
        subject: msg.subject,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt || msg.createdAt,
        isRead: msg.isRead,
        campaign_id: msg.campaign_id,
      })));
    });

    // Sort by createdAt descending
    allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = allMessages.length;
    const messages = allMessages.slice(skip, skip + limitNum);

    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return {
      messages,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getConversation = async (ctx: Context) => {
  try {
    const { userAddress, otherAddress } = ctx.params as {
      userAddress: string;
      otherAddress: string;
    };
    const {
      page = 1,
      limit = 20,
      campaign_id,
    } = ctx.query as {
      page?: string;
      limit?: string;
      campaign_id?: string;
    };

    if (!userAddress || !otherAddress) {
      ctx.set.status = 400;
      return { message: "Both user addresses are required" };
    }

    const pageNum = typeof page === "string" ? parseInt(page, 10) : page;
    const limitNum = typeof limit === "string" ? parseInt(limit, 10) : limit;

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      ctx.set.status = 400;
      return { message: "Invalid pagination parameters" };
    }

    const participants = [userAddress, otherAddress].sort();
    const campaignIdNum = campaign_id ? parseInt(campaign_id, 10) : null;

    // Find the conversation (per campaign)
    const conversation = await Conversation.findOne({
      participants,
      campaign_id: campaignIdNum
    });

    if (!conversation) {
      return {
        messages: [],
        pagination: {
          currentPage: pageNum,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limitNum,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    // Paginate messages (they are in chronological order)
    const total = conversation.messages.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedMessages = conversation.messages.slice(startIndex, endIndex).map(msg => ({
      _id: (msg as any)._id,
      sender_address: msg.sender_address,
      receiver_address: msg.receiver_address,
      message: msg.message,
      subject: msg.subject,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt || msg.createdAt,
      isRead: msg.isRead,
      campaign_id: msg.campaign_id,
    })); // Keep chronological order

    // Mark messages as read (messages received by current user)
    const messagesToMarkRead = conversation.messages.filter(
      msg => msg.sender_address === otherAddress && !msg.isRead
    );

    if (messagesToMarkRead.length > 0) {
      // Update in memory
      conversation.messages.forEach(msg => {
        if (msg.sender_address === otherAddress && !msg.isRead) {
          msg.isRead = true;
        }
      });
      await conversation.save();
    }

    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    return {
      messages: paginatedMessages,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNext,
        hasPrev,
      },
    };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const improveCampaign = async (ctx: Context) => {
  try {
    const { campaignId, field, context, currentValue } = ctx.body as {
      campaignId?: string;
      field: "name" | "description";
      context: string;
      currentValue?: string;
    };

    if (!field || !context) {
      ctx.set.status = 400;
      return { message: "Missing required fields: field, context" };
    }

    if (!["name", "description"].includes(field)) {
      ctx.set.status = 400;
      return { message: "Invalid field. Must be 'name' or 'description'" };
    }

    let currentValueToUse = currentValue;

    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        ctx.set.status = 404;
        return { message: "Campaign not found" };
      }
      currentValueToUse = campaign[field];
    } else if (!currentValue) {
      ctx.set.status = 400;
      return {
        message: "currentValue is required when campaignId is not provided",
      };
    }

    const cerebras = new Cerebras({
      apiKey: process.env["CEREBRAS_API_KEY"],
    });

    const maxLength = field === "name" ? 100 : 256;

    const stream = await cerebras.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Improve the following ${field} for a campaign using the provided context. The improved ${field} must be at most ${maxLength} characters long. Only output the improved ${field}, nothing else.`,
        },
        {
          role: "user",
          content: `Current ${field}: ${currentValue}\nContext: ${context}`,
        },
      ],
      model: "gpt-oss-120b",
      stream: true,
      max_completion_tokens: 65536,
      temperature: 1,
      top_p: 1,
      reasoning_effort: "medium",
    });

    let improvedText = "";
    for await (const chunk of stream) {
      improvedText += (chunk as any).choices[0]?.delta?.content || "";
    }

    return { improvedText };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const getAnalytics = async (ctx: Context) => {
  try {
    const { address } = ctx.query as { address: string };

    if (!address) {
      ctx.set.status = 400;
      return { message: "User address is required" };
    }

    // Find user by address
    const user = await User.findOne({ address });
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    // Get user's campaigns
    const campaigns = await Campaign.find({ createdBy: user._id });

    // Aggregate data from memos (transactions)
    const memos = await Memo.find({
      campaign_id: { $in: campaigns.map(c => c.contractId) }
    }).sort({ createdAt: -1 });

    // Calculate daily income
    const dailyIncomeMap = new Map<string, number>();
    memos.forEach(memo => {
      const date = memo.createdAt.toISOString().split('T')[0];
      const amount = memo.amount / 100000000; // Convert octas to APT
      dailyIncomeMap.set(date, (dailyIncomeMap.get(date) || 0) + amount);
    });

    let dailyIncome = Array.from(dailyIncomeMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate weekly income
    const weeklyIncomeMap = new Map<string, number>();
    memos.forEach(memo => {
      const date = new Date(memo.createdAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      const amount = memo.amount / 100000000;
      weeklyIncomeMap.set(weekKey, (weeklyIncomeMap.get(weekKey) || 0) + amount);
    });

    let weeklyIncome = Array.from(weeklyIncomeMap.entries())
      .map(([week, amount]) => ({ week: `Week of ${week}`, amount }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // Calculate top donors
    const donorMap = new Map<string, { totalAmount: number; paymentCount: number }>();
    memos.forEach(memo => {
      const amount = memo.amount / 100000000;
      const existing = donorMap.get(memo.user_address) || { totalAmount: 0, paymentCount: 0 };
      donorMap.set(memo.user_address, {
        totalAmount: existing.totalAmount + amount,
        paymentCount: existing.paymentCount + 1
      });
    });

    let donorRanking = Array.from(donorMap.entries())
      .map(([address, data]) => ({
        address: address.slice(0, 10) + '...',
        totalAmount: data.totalAmount,
        paymentCount: data.paymentCount
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10); // Top 10 donors

    // If no real data, provide sample data for demonstration
    if (campaigns.length === 0) {
      // Sample campaigns data
      const sampleCampaigns = [
        { name: "Support My Art", totalRaised: 25.5, supporterCount: 8, isActive: true },
        { name: "Coffee Shop Tips", totalRaised: 15.2, supporterCount: 12, isActive: true },
        { name: "Digital Art Pack", totalRaised: 45.8, supporterCount: 5, isActive: false }
      ];

      // Generate sample daily income for the last 7 days
      dailyIncome = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const amount = Math.random() * 10 + 2; // Random amount between 2-12 APT
        dailyIncome.push({
          date: date.toISOString().split('T')[0],
          amount: Math.round(amount * 100) / 100
        });
      }

      // Generate sample weekly income
      weeklyIncome = [
        { week: "Week of 2025-09-23", amount: 45.2 },
        { week: "Week of 2025-09-30", amount: 62.8 },
        { week: "Week of 2025-10-07", amount: 38.9 }
      ];

      // Generate sample donor ranking
      donorRanking = [
        { address: "0x1234...abcd", totalAmount: 25.5, paymentCount: 3 },
        { address: "0x5678...efgh", totalAmount: 18.2, paymentCount: 2 },
        { address: "0x9abc...ijkl", totalAmount: 12.8, paymentCount: 1 },
        { address: "0xdef0...mnop", totalAmount: 8.9, paymentCount: 1 }
      ];
    }

    // Mock traffic sources (could be implemented with real tracking later)
    const trafficSources = [
      { source: "Direct", visits: Math.floor(Math.random() * 100) + 50 },
      { source: "Twitter", visits: Math.floor(Math.random() * 80) + 20 },
      { source: "Discord", visits: Math.floor(Math.random() * 60) + 10 },
      { source: "Other", visits: Math.floor(Math.random() * 40) + 5 }
    ];

    return {
      dailyIncome,
      weeklyIncome,
      donorRanking,
      trafficSources
    };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};

export const analyzeCampaigns = async (ctx: Context) => {
  try {
    const { campaigns, analytics, userAddress } = ctx.body as {
      campaigns: any[];
      analytics: any;
      userAddress: string;
    };

    if (!campaigns || !analytics || !userAddress) {
      ctx.set.status = 400;
      return { message: "Missing required fields: campaigns, analytics, userAddress" };
    }

    const cerebras = new Cerebras({
      apiKey: process.env["CEREBRAS_API_KEY"],
    });

    // Prepare data summary for AI analysis
    const summary = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.isActive).length,
      totalRaised: campaigns.reduce((sum, c) => sum + c.totalRaised, 0),
      totalSupporters: campaigns.reduce((sum, c) => sum + c.supporterCount, 0),
      topDonors: analytics.donorRanking?.slice(0, 5) || [],
      recentIncome: analytics.dailyIncome?.slice(-7) || [],
      campaignTypes: campaigns.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    const stream = await cerebras.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert campaign analyst. Analyze the provided campaign data and provide actionable insights, recommendations, and performance analysis in HTML format using Tailwind CSS classes. All amounts are in APT (Aptos cryptocurrency). Use dark theme classes like text-gray-300 for body text, text-white for headings, bg-slate-800/50 for sections, border-cyan-500/20 for borders, etc. Focus on:
          - Overall performance trends
          - Campaign effectiveness by type
          - Donor behavior patterns
          - Recommendations for improvement
          - Growth opportunities
          Keep the analysis concise but comprehensive, around 300-500 words. Return only the HTML body content without DOCTYPE, html, head, or body tags - just the inner HTML elements with Tailwind classes.`,
        },
        {
          role: "user",
          content: `Campaign Analytics Summary:
${JSON.stringify(summary, null, 2)}

Please provide a detailed analysis of this campaign data in HTML format.`,
        },
      ],
      model: "gpt-oss-120b",
      stream: true,
      max_completion_tokens: 65536,
      temperature: 0.7,
      top_p: 1,
      reasoning_effort: "medium",
    });

    let analysis = "";
    for await (const chunk of stream) {
      analysis += (chunk as any).choices[0]?.delta?.content || "";
    }

    return { analysis };
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error", error };
  }
};
