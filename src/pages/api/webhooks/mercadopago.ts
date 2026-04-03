// src/pages/api/webhooks/mercadopago.ts
// Webhook handler para notificaciones de MercadoPago

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { prisma } from "@/lib/supabase";

export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function verifySignature(rawBody: string, req: NextApiRequest): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MERCADO_PAGO_WEBHOOK_SECRET not configured — rejecting webhook");
    return false;
  }

  const xSignature = req.headers["x-signature"] as string;
  const xRequestId = req.headers["x-request-id"] as string;
  const dataId = req.query["data.id"] as string;

  if (!xSignature) return false;

  // MP signature format: ts=<timestamp>,v1=<hash>
  const parts = xSignature.split(",");
  const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
  const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
}

async function fetchMPResource(url: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function handlePreapproval(preapprovalId: string) {
  const data = await fetchMPResource(`https://api.mercadopago.com/preapproval/${preapprovalId}`);
  if (!data) return;

  // external_reference = "userId|plan"
  const [userId, plan] = (data.external_reference || "").split("|");
  if (!userId || !plan) return;

  // Verify userId is a valid existing user before any DB writes
  const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!userExists) {
    console.error(`MP webhook: userId '${userId}' not found in DB — ignoring`);
    return;
  }

  const status = data.status; // authorized, paused, cancelled, pending

  const subscriptionStatus =
    status === "authorized" ? "active" :
    status === "paused" ? "paused" :
    status === "cancelled" ? "cancelled" : "pending";

  // Upsert subscription record
  const existing = await prisma.subscription.findFirst({ where: { user_id: userId } });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        is_active: subscriptionStatus === "active",
        plan_name: plan,
      },
    });
  } else {
    const planData = await prisma.subscription.create({
      data: {
        user_id: userId,
        plan_id: plan,
        plan_name: plan.charAt(0).toUpperCase() + plan.slice(1),
        price: plan === "starter" ? 1999 : plan === "pro" ? 4999 : 9999,
        currency: "ARS",
        features: [],
        max_bots: plan === "starter" ? 3 : plan === "pro" ? 10 : 50,
        max_messages_per_month: plan === "starter" ? 1000 : plan === "pro" ? 10000 : 100000,
        ai_enabled: true,
        is_active: subscriptionStatus === "active",
      },
    });
  }

  // Update user plan
  if (subscriptionStatus === "active") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription_plan: plan,
        subscription_status: "active",
      },
    });
  } else if (subscriptionStatus === "cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription_plan: "free",
        subscription_status: "inactive",
      },
    });
  }

  // Log webhook event
  await prisma.webhookEvent.create({
    data: {
      event_type: `preapproval.${status}`,
      payload: data,
      processed: true,
    },
  });
}

async function handlePayment(paymentId: string) {
  const data = await fetchMPResource(`https://api.mercadopago.com/v1/payments/${paymentId}`);
  if (!data) return;

  // Log payment
  if (data.status === "approved" && data.metadata?.user_id) {
    await prisma.payment.create({
      data: {
        user_id: data.metadata.user_id,
        amount: data.transaction_amount,
        currency: data.currency_id,
        status: "completed",
        payment_method: "mercadopago",
        external_payment_id: String(paymentId),
      },
    }).catch(() => {}); // ignore duplicate
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);

  // Verify signature (skip if no secret configured)
  if (process.env.MERCADO_PAGO_WEBHOOK_SECRET && !verifySignature(rawBody, req)) {
    console.warn("Invalid MP webhook signature");
    return res.status(401).json({ error: "Invalid signature" });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { type, action, data } = body;

  try {
    if (type === "subscription_preapproval" || action?.includes("preapproval")) {
      await handlePreapproval(data?.id);
    } else if (type === "payment" || action?.includes("payment")) {
      await handlePayment(data?.id);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Always return 200 to avoid MP retries for processing errors
    return res.status(200).json({ received: true, error: "Processing error logged" });
  }
}
