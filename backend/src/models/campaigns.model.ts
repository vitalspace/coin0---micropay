import mongoose, { type Document, ObjectId, Schema } from "mongoose";
import { CampaignType } from "../types/types";

interface ICampaign extends Document {
  type: CampaignType;
  name: string;
  description: string;
  goal?: number;
  price?: number;
  image?: string;
  contractId?: number; // Blockchain campaign ID
  transaction_hash?: string; // Blockchain transaction hash for campaign creation
  isActive: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IMemo extends Document {
  campaign_id: number;
  creator_address: string;
  memo: string;
  transaction_hash: string;
  type: "donation" | "purchase";
  user_address: string;
}

const CampaignSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["donation", "business", "product"],
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number },
    price: { type: Number },
    image: { type: String },
    contractId: { type: Number }, // Blockchain campaign ID
    transaction_hash: { type: String }, // Blockchain transaction hash for campaign creation
    isActive: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const MemoSchema: Schema = new Schema(
  {
    campaign_id: { type: Number, required: true, ref: "Campaign" },
    creator_address: { type: String, required: true },
    memo: { type: String, required: true, maxlength: 256 },
    transaction_hash: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["donation", "purchase"] },
    user_address: { type: String, required: true },
  },
  { timestamps: true }
);

const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);
const Memo = mongoose.model<IMemo>("Memo", MemoSchema);

export { Campaign as default, Memo };
