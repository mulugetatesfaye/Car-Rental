import { httpRouter, httpActionGeneric } from "convex/server";
import { auth } from "./auth";
import Stripe from "stripe";
import { internal } from "./_generated/api";

"use node";

const http = httpRouter();

auth.addHttpRoutes(http);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

http.route({
  path: "/webhooks/stripe",
  method: "POST",
  handler: httpActionGeneric(async (ctx, request) => {
    const sig = request.headers.get("stripe-signature");
    if (!sig) {
      return new Response("No signature", { status: 400 });
    }

    const rawBody = await request.clone().text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch {
      return new Response("Invalid signature", { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        const paymentIntentId = session.payment_intent as string | null;

        const existing = await ctx.runQuery(internal.payments.getByStripeSessionId, {
          stripeCheckoutSessionId: sessionId,
        });
        if (existing) break;

        const rideData = JSON.parse(session.metadata?.rideData || "{}");
        if (!rideData.customerName) break;

        const rideId = await ctx.runMutation(internal.rides.createFromWebhook, {
          ...rideData,
          stripeCheckoutSessionId: sessionId,
        });

        if (rideId) {
          await ctx.runMutation(internal.payments.createPaymentRecord, {
            rideId,
            stripeCheckoutSessionId: sessionId,
            stripePaymentIntentId: paymentIntentId ?? undefined,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency ?? "usd",
            status: "succeeded",
            paymentMethod: session.payment_method_types?.[0] ?? "card",
          });
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string | null;
        if (paymentIntentId) {
          await ctx.runMutation(internal.payments.markRefunded, {
            stripePaymentIntentId: paymentIntentId,
            refundAmount: charge.amount_refunded / 100,
          });
        }
        break;
      }
      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }),
});

export default http;
