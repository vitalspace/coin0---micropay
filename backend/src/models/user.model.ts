import mongoose, { type Document, Schema } from "mongoose";

interface IUser extends Document {
  address: string;
  avatar: string;
  nickname: string;
  followers?: number;
  following?: number;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    nickname: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
