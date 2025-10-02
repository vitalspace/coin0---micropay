import mongoose, { type Document, ObjectId, Schema } from "mongoose";
import { CampaignType } from "../types/types";

interface ICampaign extends Document {
  type: CampaignType;
  name: string;
  description: string;
  goal?: number; // Para campañas de donación
  price?: number; // Para campañas de producto
  image?: string;
  isActive: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
    goal: { type: Number }, // Para campañas de donación
    price: { type: Number }, // Para campañas de producto
    image: { type: String },
    isActive: { type: Boolean, required: true, default: true },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);
export default Campaign;
