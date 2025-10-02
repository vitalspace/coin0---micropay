import { Context } from "elysia";
import { ObjectId } from "mongoose";
import Campaign from "../models/campaigns.model";
import User from "../models/user.model";
import { ICampaignData } from "../types/types";

export const createCampaign = async (ctx: Context) => {
  try {
    const { type, name, description, goal, price, image, createdBy } =
      ctx.body as ICampaignData;
  
      if (!type || !name || !description || !createdBy) {
      ctx.set.status = 400;
      return { message: "Missing required fields" };
    }
  
    if (!["donation", "business", "product"].includes(type)) {
      ctx.set.status = 400;
      return { message: "Invalid campaign type" };
    }

    const user = await User.findById(createdBy);
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    const campaign = new Campaign({
      type,
      name,
      description,
      goal: type === "donation" ? goal : undefined,
      price: (type === "product" || type === "business") ? price : undefined,
      image,
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
