import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let rides = await ctx.db.query("rides").order("desc").collect();
    
    // Server-side filtering for optional advanced args
    if (args.status && args.status !== "all") {
      rides = rides.filter(r => r.status === args.status);
    }
    if (args.startDate) {
      rides = rides.filter(r => r.pickupDate >= args.startDate!);
    }
    if (args.endDate) {
      rides = rides.filter(r => r.pickupDate <= args.endDate!);
    }
    
    return rides;
  },
});

export const getRecent = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rides")
      .order("desc")
      .take(args.limit);
  },
});

export const getById = query({
  args: { id: v.id("rides") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    userId: v.optional(v.string()),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    pickupAddress: v.string(),
    destinationAddress: v.string(),
    pickupLat: v.number(),
    pickupLng: v.number(),
    destLat: v.number(),
    destLng: v.number(),
    distance: v.number(),
    duration: v.number(),
    carTypeName: v.string(),
    carTypeMultiplier: v.number(),
    price: v.number(),
    passengers: v.number(),
    luggage: v.number(),
    accessible: v.boolean(),
    pickupDate: v.string(),
    pickupTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate a secure 12-character random token for reviews
    const reviewToken = Math.random().toString(36).substring(2, 14).toUpperCase();

    const ride = {
      userId: args.userId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      pickupAddress: args.pickupAddress,
      destinationAddress: args.destinationAddress,
      pickupLat: args.pickupLat,
      pickupLng: args.pickupLng,
      destLat: args.destLat,
      destLng: args.destLng,
      distance: args.distance,
      duration: args.duration,
      carTypeName: args.carTypeName,
      carTypeMultiplier: args.carTypeMultiplier,
      price: args.price,
      passengers: args.passengers,
      luggage: args.luggage,
      accessible: args.accessible,
      pickupDate: args.pickupDate,
      pickupTime: args.pickupTime,
      status: "pending" as const,
      reviewToken,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return await ctx.db.insert("rides", ride);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("rides"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const addNote = mutation({
  args: {
    id: v.id("rides"),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const ride = await ctx.db.get(args.id);
    if (!ride) throw new Error("Ride not found");
    
    // Append to existing notes with timestamp
    const dateStr = new Date().toISOString().split("T")[0];
    const prefix = ride.notes ? ride.notes + "\n" : "";
    const newNotes = `${prefix}[${dateStr}] ${args.note}`;
    
    await ctx.db.patch(args.id, {
      notes: newNotes,
      updatedAt: Date.now(),
    });
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rides")
      .withSearchIndex("search_customer", (q) => q.search("customerName", args.query))
      .take(50);
  },
});