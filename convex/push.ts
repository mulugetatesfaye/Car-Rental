import { internalAction, internalQuery } from "./_generated/server";
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
    
    console.log(`Push Alert: Found ${admins.length} admins to notify.`);

    if (admins.length === 0) {
      console.warn("Push Alert: No admins found with isAdmin=true and a pushAlertSubscriberId.");
      return;
    }

    const apiKey = process.env.PUSHALERT_API_KEY;
    if (!apiKey) {
      console.error("Push Alert: PUSHALERT_API_KEY is not defined in Convex environmental variables.");
      return;
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://lunalimoz.com').replace(/\/$/, "");

    for (const admin of admins) {
      console.log(`Push Alert: Sending to admin ${admin.name || admin.email} (${admin.pushAlertSubscriberId})`);
      
      try {
        const absoluteUrl = args.url ? (args.url.startsWith("/") ? `${siteUrl}${args.url}` : args.url) : siteUrl;

        const response = await fetch("https://pushalert.co/api/v1/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `api_key=${apiKey}`,
          },
          body: JSON.stringify({
            subscriber: admin.pushAlertSubscriberId,
            title: args.title,
            message: args.message,
            url: absoluteUrl,
            icon: `${siteUrl}/luna-logo.png`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Push Alert: Failed to send to admin ${admin._id}. Status: ${response.status}`, errorData);
        } else {
          console.log(`Push Alert: Successfully sent to admin ${admin._id}`);
        }
      } catch (error) {
        console.error(`Push Alert: Request error for admin ${admin._id}:`, error);
      }
    }
  },
});

export const getAdminsWithPushId = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_admin", (q) => q.eq("isAdmin", true))
      .filter((q) => q.neq(q.field("pushAlertSubscriberId"), undefined))
      .collect();
  },
});
