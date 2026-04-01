import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    status: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let rides;
    const validStatuses = ["pending", "confirmed", "cancelled"] as const;
    const statusFilter = args.status && args.status !== "all" && validStatuses.includes(args.status as typeof validStatuses[number])
      ? args.status as typeof validStatuses[number]
      : null;
    
    if (statusFilter) {
      rides = await ctx.db
        .query("rides")
        .withIndex("by_status", (q) => q.eq("status", statusFilter))
        .order("desc")
        .take(500);
    } else {
      rides = await ctx.db.query("rides").order("desc").take(500);
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

export const listPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const validStatuses = ["pending", "confirmed", "cancelled"] as const;
    const statusFilter = args.status && args.status !== "all" && validStatuses.includes(args.status as typeof validStatuses[number])
      ? args.status as typeof validStatuses[number]
      : null;
    
    if (statusFilter) {
      return await ctx.db
        .query("rides")
        .withIndex("by_status", (q) => q.eq("status", statusFilter))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    
    return await ctx.db
      .query("rides")
      .order("desc")
      .paginate(args.paginationOpts);
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
    serviceType: v.union(
      v.literal("point_to_point"),
      v.literal("hourly")
    ),
    hourlyDuration: v.optional(v.number()),
    pickupDate: v.string(),
    pickupTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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
      serviceType: args.serviceType,
      hourlyDuration: args.hourlyDuration,
      pickupDate: args.pickupDate,
      pickupTime: args.pickupTime,
      status: "pending" as const,
      reviewToken,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const rideId = await ctx.db.insert("rides", ride);
    
    // Trigger the email asynchronously
    await ctx.scheduler.runAfter(0, internal.emails.sendBookingEmail, { 
      rideId, 
      type: "new_booking" 
    });

    // Notify admins via push
    await ctx.scheduler.runAfter(0, internal.push.notifyAdmins, {
      title: "New Booking!",
      message: `A new ${args.carTypeName} booking was made by ${args.customerName}.`,
      url: `/admin/rides/${rideId}`
    });

    // Create in-app notification
    await ctx.scheduler.runAfter(0, internal.notifications.create, {
      type: "new_booking",
      title: "New Booking Received",
      message: `${args.customerName} booked a ${args.carTypeName} for ${args.pickupDate}.`,
      link: "/admin/bookings",
    });
    
    return rideId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("rides"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const ride = await ctx.db.get(args.id);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Trigger status update email
    await ctx.scheduler.runAfter(0, internal.emails.sendBookingEmail, { 
      rideId: args.id, 
      type: "status_update",
      newStatus: args.status
    });

    // Create in-app notification for status changes
    const notifType = args.status === "cancelled" ? "cancellation" as const : "status_update" as const;
    const customerName = ride?.customerName || "A customer";
    await ctx.scheduler.runAfter(0, internal.notifications.create, {
      type: notifType,
      title: args.status === "cancelled" ? "Booking Cancelled" : "Status Updated",
      message: `${customerName}'s booking has been ${args.status}.`,
      link: "/admin/bookings",
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