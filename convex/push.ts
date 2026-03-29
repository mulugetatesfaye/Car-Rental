import { internalAction, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const notifyAdmins = internalAction({
  args: {
    title: v.string(),
    message: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admins = await ctx.runQuery(internal.push.getAdminsWithPushId);

    for (const admin of admins) {
      if (!admin.pushAlertSubscriberId) continue;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscriber: admin.pushAlertSubscriberId,
            title: args.title,
            message: args.message,
            url: args.url,
          }),
        });
      } catch (error) {
        console.error(`Failed to send push to admin ${admin._id}:`, error);
      }
    }
  },
});

export const getAdminsWithPushId = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_admin", (q) => q.eq("isAdmin", true))
      .filter((q) => q.neq(q.field("pushAlertSubscriberId"), undefined))
      .collect();
  },
});
