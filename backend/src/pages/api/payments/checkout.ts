// src/pages/api/payments/checkout.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "@/lib/supabase";
import { createStripeCustomer, createSubscription, SUBSCRIPTION_PLANS } from "@/lib/stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getCurrentUser();

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { plan } = req.body;

    // Validate plan
    const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    if (!planConfig) {
      res.status(400).json({ error: "Invalid plan" });
      return;
    }

    // Get or create Stripe customer
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    let stripeCustomerId = dbUser?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(
        user.email || "",
        user.user_metadata?.name || "Unknown",
        {
          user_id: user.id,
        }
      );

      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      dbUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          stripe_customer_id: stripeCustomerId,
        },
      });
    }

    // Create checkout session
    if (plan === "free") {
      // Free plan - no checkout needed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscription_plan: "free",
          subscription_status: "active",
        },
      });

      res.status(200).json({
        success: true,
        plan: "free",
      });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: planConfig.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        user_id: user.id,
        plan: plan,
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
