import { mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const backfillReviewTokens = mutation({
  args: {},
  handler: async (ctx) => {
    const ridesWithNoToken = await ctx.db
      .query("rides")
      .filter((q) => q.eq(q.field("reviewToken"), undefined))
      .collect();

    for (const ride of ridesWithNoToken) {
      const reviewToken = Math.random().toString(36).substring(2, 14).toUpperCase();
      await ctx.db.patch(ride._id, { reviewToken });
    }

    return ridesWithNoToken.length;
  },
});

export const migrateLegacyStatuses = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const size = args.batchSize ?? 100;
    const page = await ctx.db
      .query("rides")
      .withIndex("by_status", (q) => q.eq("status", "in_progress"))
      .take(size);

    let migrated = 0;
    for (const ride of page) {
      await ctx.db.patch(ride._id, { status: "confirmed" });
      migrated++;
    }

    const completedPage = await ctx.db
      .query("rides")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .take(size);

    for (const ride of completedPage) {
      await ctx.db.patch(ride._id, { status: "confirmed" });
      migrated++;
    }

    return migrated;
  },
});
