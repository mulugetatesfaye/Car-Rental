import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    return users[0];
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const user = {
      name: args.name,
      email: args.email,
      phone: args.phone,
      createdAt: now,
      updatedAt: now,
    };
    return await ctx.db.insert("users", user);
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      ...(args.name && { name: args.name }),
      ...(args.phone && { phone: args.phone }),
      updatedAt: Date.now(),
    });
  },
});