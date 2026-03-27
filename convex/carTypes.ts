import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("carTypes").collect();
  },
});

export const getById = query({
  args: { id: v.id("carTypes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const seedCarTypes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("carTypes").collect();
    if (existing.length > 0) return;

    const carTypes = [
      {
        name: "Executive Sedan",
        description: "Mercedes E-Class or similar. Perfect for business travel with premium comfort.",
        image: "/cars/sedan.png",
        baseFare: 25,
        perKmRate: 2.5,
        perMinuteRate: 0.5,
        multiplier: 1.0,
        capacity: 3,
        isActive: true,
        createdAt: Date.now(),
      },
      {
        name: "Luxury SUV",
        description: " Cadillac Escalade or similar. Spacious luxury for groups up to 6.",
        image: "/cars/suv.png",
        baseFare: 45,
        perKmRate: 3.5,
        perMinuteRate: 0.7,
        multiplier: 1.4,
        capacity: 6,
        isActive: true,
        createdAt: Date.now(),
      },
      {
        name: "Premium Electric",
        description: "Tesla Model S or similar. Eco-conscious luxury with cutting-edge technology.",
        image: "/cars/tesla.png",
        baseFare: 55,
        perKmRate: 4.0,
        perMinuteRate: 0.8,
        multiplier: 1.6,
        capacity: 4,
        isActive: true,
        createdAt: Date.now(),
      },
      {
        name: "Limousine",
        description: "Stretch limousine. The ultimate in luxury for special occasions.",
        image: "/cars/limo.png",
        baseFare: 100,
        perKmRate: 5.0,
        perMinuteRate: 1.0,
        multiplier: 2.2,
        capacity: 10,
        isActive: true,
        createdAt: Date.now(),
      },
    ];

    for (const carType of carTypes) {
      await ctx.db.insert("carTypes", carType);
    }
  },
});