import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  carTypes: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    baseFare: v.number(),
    perKmRate: v.number(),
    perMinuteRate: v.number(),
    multiplier: v.number(),
    capacity: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  rides: defineTable({
    userId: v.optional(v.string()),
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
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
});