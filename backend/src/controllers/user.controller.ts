import { Context } from "elysia";
import User from "../models/user.model";
import { type IUser } from "../types/types";

export const createUser = async (ctx: Context) => {
  try {
    const { address } = ctx.body as IUser;

    const existingUser = await User.findOne({ address });
    if (existingUser) {
      ctx.set.status = 409;
      return { message: "User already exists" };
    }

    const user = new User({
      address,
    });

    await user.save();

    ctx.set.status = 201;
    return JSON.stringify(user);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error" };
  }
};

export const profile = async (ctx: Context) => {
  try {
    const { address } = ctx.body as IUser;

    const user = await User.findOne({ address })
      .select("-__v")
      .select("-_id")
      .select("-updatedAt");

    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }

    ctx.set.status = 200;
    return JSON.stringify(user);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error" };
  }
};

export const updateProfile = async (ctx: Context) => {
  try {
    const { address, ...updates } = ctx.body as IUser;
    const user = await User.findOneAndUpdate({ address }, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      ctx.set.status = 404;
      return { message: "User not found" };
    }
    ctx.set.status = 200;
    return JSON.stringify(user);
  } catch (error) {
    ctx.set.status = 500;
    return { message: "Internal server error" };
  }
};
