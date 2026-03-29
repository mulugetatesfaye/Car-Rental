import { internalAction, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { internal } from "./_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Internal query to securely fetch data for the email action
export const getEmailData = internalQuery({
  args: { rideId: v.id("rides") },
  handler: async (ctx, args) => {
    const ride = await ctx.db.get(args.rideId);
    const settings = await ctx.db.query("settings").first();
    return { ride, settings };
  },
});

export const sendBookingEmail = internalAction({
  args: {
    rideId: v.id("rides"),
    type: v.union(v.literal("new_booking"), v.literal("status_update")),
    newStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(internal.emails.getEmailData, { rideId: args.rideId });
    if (!data.ride || !data.settings) throw new Error("Data not found for email");

    const { ride, settings } = data;
    
    // As requested, using the testing domain provided by Resend
    const fromAddress = "Luna Limo <onboarding@resend.dev>";
    // Sending to both customer and admin. Note: Under Resend's free tier with onboarding@resend.dev, 
    // it may only actually deliver to the verified Resend account owner's email address.
    const rawToAddresses = [ride.customerEmail, settings.email].filter(Boolean) as string[];
    const toAddresses = Array.from(new Set(rawToAddresses));

    const isNew = args.type === "new_booking";
    const statusText = isNew ? "RECEIVED" : (args.newStatus || ride.status).toUpperCase().replace("_", " ");
    const subject = isNew 
      ? `Reservation Received: Luna Limo Executive Service`
      : `Reservation Update [${statusText}]: Luna Limo`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border: 1px solid #333;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid #333; padding-bottom: 20px;">
          <h1 style="color: #C6A87C; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 4px; font-style: italic;">Luna Limo</h1>
          <p style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Executive Transportation</p>
        </div>

        <h2 style="color: #fff; font-size: 18px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">
          ${isNew ? "Booking Confirmation" : "Booking Update"}
        </h2>
        
        <p style="color: #ccc; line-height: 1.6; font-size: 14px;">
          Dear ${ride.customerName},<br><br>
          ${isNew 
            ? "Your reservation has been received and is currently Pending review by our dispatch team. You will receive an update once it is confirmed." 
            : `The status of your reservation has been updated to: <strong style="color: #C6A87C;">${statusText}</strong>`
          }
        </p>

        <div style="background-color: #111; border-left: 3px solid #C6A87C; padding: 20px; margin: 30px 0;">
          <h3 style="color: #C6A87C; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; margin-bottom: 15px;">Journey Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #888; padding: 8px 0; width: 35%; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Date & Time</td>
              <td style="color: #fff; padding: 8px 0;"><strong>${ride.pickupDate} @ ${ride.pickupTime || "TBD"}</strong></td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0; border-top: 1px solid #222; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Pickup</td>
              <td style="color: #fff; padding: 8px 0; border-top: 1px solid #222;">${ride.pickupAddress}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0; border-top: 1px solid #222; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Destination</td>
              <td style="color: #fff; padding: 8px 0; border-top: 1px solid #222;">${ride.destinationAddress}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0; border-top: 1px solid #222; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Vehicle Class</td>
              <td style="color: #fff; padding: 8px 0; border-top: 1px solid #222;">${ride.carTypeName}</td>
            </tr>
            <tr>
              <td style="color: #888; padding: 8px 0; border-top: 1px solid #222; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">Total Fare</td>
              <td style="color: #C6A87C; padding: 8px 0; border-top: 1px solid #222; font-size: 16px; font-weight: bold; font-style: italic;">$${ride.price.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <p style="color: #888; font-size: 12px; margin-top: 40px; text-align: center;">
          For any changes or inquiries, please reply to this email or contact our dispatch team.<br>
          <strong style="color: #ccc;">${settings.phone}</strong> | ${settings.email}
        </p>
      </div>
    `;

    try {
      const resp = await resend.emails.send({
        from: fromAddress,
        to: toAddresses,
        subject,
        html: htmlContent,
      });
      console.log("Email dispatch success:", resp);
    } catch (error) {
      console.error("Failed to send email via Resend:", error);
    }
  },
});
