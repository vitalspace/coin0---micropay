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
  totalRaised: number; // Total amount raised in APT
  supporterCount: number; // Number of unique supporters
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

interface IConversation extends Document {
  participants: [string, string]; // Sorted array of two addresses
  campaign_id: number | null; // Campaign ID for per-campaign conversations
  messages: Array<{
    sender_address: string;
    receiver_address: string;
    message: string;
    subject?: string; // Subject for contextual information
    createdAt: Date;
    updatedAt: Date;
    isRead: boolean;
    campaign_id?: number; // Optional, for campaign-related messages
  }>;
  lastMessageAt: Date;
}

interface IMessage extends Document {
  sender_address: string;
  receiver_address: string;
  campaign_id?: number; // Optional, for campaign-related messages
  message: string;
  subject?: string; // Subject for contextual information
  isRead: boolean;
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
    totalRaised: { type: Number, required: true, default: 0 },
    supporterCount: { type: Number, required: true, default: 0 },
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

const ConversationSchema: Schema = new Schema(
  {
    participants: {
      type: [String],
      required: true,
      validate: {
        validator: function(arr: string[]) {
          return arr.length === 2 && arr[0] < arr[1]; // Ensure sorted and unique
        },
        message: 'Participants must be exactly two unique addresses, sorted alphabetically.'
      }
    },
    campaign_id: { type: Number, default: null }, // Campaign ID for per-campaign conversations
    messages: [{
      sender_address: { type: String, required: true },
      receiver_address: { type: String, required: true },
      message: { type: String, required: true, maxlength: 1000 },
      subject: { type: String }, // Subject for contextual information
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      isRead: { type: Boolean, required: true, default: false },
      campaign_id: { type: Number }, // Optional, for campaign-related messages
    }],
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for unique conversations per campaign
ConversationSchema.index({ participants: 1, campaign_id: 1 }, { unique: true });

const MessageSchema: Schema = new Schema(
  {
    sender_address: { type: String, required: true },
    receiver_address: { type: String, required: true },
    campaign_id: { type: Number }, // Optional, for campaign-related messages
    message: { type: String, required: true, maxlength: 1000 },
    subject: { type: String }, // Subject for contextual information
    isRead: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);
const Memo = mongoose.model<IMemo>("Memo", MemoSchema);
const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export { Campaign as default, Memo, Conversation, Message };
