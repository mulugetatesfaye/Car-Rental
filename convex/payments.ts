import { action, query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";
import { internal } from "./_generated/api";

"use node";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = action({
  args: {
    carTypeName: v.string(),
    distance: v.number(),
    duration: v.number(),
    serviceType: v.union(v.literal("point_to_point"), v.literal("hourly")),
    hourlyDuration: v.optional(v.number()),
    carTypeMultiplier: v.number(),
    price: v.number(),
    customerEmail: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    pickupAddress: v.string(),
    destinationAddress: v.string(),
    pickupLat: v.number(),
    pickupLng: v.number(),
    destLat: v.number(),
    destLng: v.number(),
    passengers: v.number(),
    luggage: v.number(),
    accessible: v.boolean(),
    pickupDate: v.string(),
    pickupTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const carType = await ctx.runQuery(internal.carTypes.getByName, {
      name: args.carTypeName,
    });

    if (!carType) {
      throw new Error("Vehicle type not found");
    }

    let calculatedPrice: number;
    if (args.serviceType === "hourly") {
      const hours = args.hourlyDuration || 2;
      calculatedPrice = Math.round(
        hours * (carType.hourlyRate || 0) * carType.multiplier * 100
      ) / 100;
    } else {
      const baseFare = carType.baseFare;
      const distanceCharge = args.distance * carType.perKmRate * carType.multiplier;
      const timeCharge = args.duration * carType.perMinuteRate * carType.multiplier;
      calculatedPrice = Math.round((baseFare + distanceCharge + timeCharge) * 100) / 100;
    }

    const settings = await ctx.runQuery(internal.settings.getInternal);
    const minimumFare = settings?.minimumFare || 0;
    if (calculatedPrice < minimumFare) {
      calculatedPrice = minimumFare;
    }

    if (Math.abs(calculatedPrice - args.price) > 0.01) {
      throw new Error("Price has changed. Please refresh and try again.");
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const deployment = process.env.CONVEX_CLOUD_URL;
    const isLocal = deployment?.includes("127.0.0.1") || deployment?.includes("localhost");
    const baseUrl = isLocal ? "http://localhost:3000" : origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "paypal"],
      customer_email: args.customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Luna Limo - ${args.carTypeName}`,
              description:
                args.serviceType === "hourly"
                  ? `${args.hourlyDuration} hour charter service`
                  : `${args.pickupAddress} → ${args.destinationAddress}`,
            },
            unit_amount: Math.round(calculatedPrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        rideData: JSON.stringify({
          customerName: args.customerName,
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
          price: calculatedPrice,
          passengers: args.passengers,
          luggage: args.luggage,
          accessible: args.accessible,
          serviceType: args.serviceType,
          hourlyDuration: args.hourlyDuration,
          pickupDate: args.pickupDate,
          pickupTime: args.pickupTime,
        }),
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking`,
    });

    return { url: session.url };
  },
});

export const verifyCheckoutSession = action({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args): Promise<
    | { status: "unpaid" }
    | { status: "already_processed"; rideId: string }
    | { status: "paid"; rideData: Record<string, unknown>; stripePaymentIntentId: string | null; amount: number; currency: string; paymentMethod: string }
  > => {
    const session = await stripe.checkout.sessions.retrieve(args.sessionId);

    if (session.payment_status !== "paid") {
      return { status: "unpaid" };
    }

    const existingRide = await ctx.runQuery(internal.rides.getByStripeSessionId, {
      stripeCheckoutSessionId: args.sessionId,
    });

    if (existingRide) {
      return { status: "already_processed", rideId: existingRide._id };
    }

    const rideData = JSON.parse(session.metadata?.rideData || "{}");

    return {
      status: "paid",
      rideData,
      stripePaymentIntentId: session.payment_intent as string | null,
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "usd",
      paymentMethod: session.payment_method_types?.[0] ?? "card",
    };
  },
});

export const getByRideId = query({
  args: { rideId: v.id("rides") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_ride", (q) => q.eq("rideId", args.rideId))
      .first();
  },
});

export const getByStripeSessionId = internalQuery({
  args: { stripeCheckoutSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_stripe_session", (q) => q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId))
      .first();
  },
});

export const createPaymentRecord = internalMutation({
  args: {
    rideId: v.id("rides"),
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("payments", {
      rideId: args.rideId,
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      amount: args.amount,
      currency: args.currency,
      status: args.status,
      paymentMethod: args.paymentMethod,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const markRefunded = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    refundAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripe_payment_intent", (q) => q.eq("stripePaymentIntentId", args.stripePaymentIntentId))
      .first();

    if (payment && payment.status !== "refunded") {
      await ctx.db.patch(payment._id, {
        status: "refunded",
        refundAmount: args.refundAmount,
        refundedAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db
        .query("rides")
        .withIndex("by_stripe_session", (q) => q.eq("stripeCheckoutSessionId", payment.stripeCheckoutSessionId))
        .first()
        .then(async (ride) => {
          if (ride) {
            await ctx.db.patch(ride._id, {
              paymentStatus: "refunded",
              updatedAt: Date.now(),
            });
          }
        });
    }
  },
});
