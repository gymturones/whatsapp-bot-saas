// src/pages/api/webhooks/stripe.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/supabase";
import {
  getWebhookEvent,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentSucceeded,
} from "@/lib/stripe";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: {
      raw: true,
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const signature = req.headers["stripe-signature"] as string;
    const body = req.body as Buffer;

    const event = getWebhookEvent(body, signature);

    if (!event) {
      res.status(400).json({ error: "Invalid signature" });
      return;
    }

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription_plan: getPlanFromSubscription(subscription),
              subscription_status: "active",
              subscription_id: subscription.id,
              billing_cycle_start: new Date(
                subscription.current_period_start * 1000
              ),
              billing_cycle_end: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const status = subscription.cancel_at_period_end
            ? "cancelled"
            : "active";

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription_status: status,
              billing_cycle_end: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription_plan: "free",
              subscription_status: "inactive",
              subscription_id: null,
            },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const userId = invoice.metadata?.user_id;

        if (userId) {
          // Create payment record
          await prisma.payment.create({
            data: {
              user_id: userId,
              amount: invoice.amount_paid / 100, // Convert from cents
              currency: invoice.currency.toUpperCase(),
              status: "completed",
              payment_method: "stripe",
              payment_id: invoice.id,
              invoice_url: invoice.hosted_invoice_url,
              receipt_url: invoice.receipt_number,
              billing_period_start: new Date(invoice.period_start * 1000),
              billing_period_end: new Date(invoice.period_end * 1000),
            },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const userId = invoice.metadata?.user_id;

        if (userId) {
          await prisma.payment.create({
            data: {
              user_id: userId,
              amount: invoice.amount_due / 100,
              currency: invoice.currency.toUpperCase(),
              status: "failed",
              payment_method: "stripe",
              payment_id: invoice.id,
              billing_period_start: new Date(invoice.period_start * 1000),
              billing_period_end: new Date(invoice.period_end * 1000),
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

function getPlanFromSubscription(subscription: any): string {
  const priceId = subscription.items.data[0]?.price?.id;

  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) {
    return "starter";
  }
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return "pro";
  }
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) {
    return "business";
  }

  return "free";
}
