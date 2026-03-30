// src/pages/api/payments/checkout.ts
// Checkout con MercadoPago Suscripciones (preapproval)

import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/supabase";

const MP_PLANS: Record<string, { planId: string; name: string; price: number }> = {
  starter: {
    planId: process.env.MERCADO_PAGO_PLAN_STARTER_ID!,
    name: "Starter",
    price: 1999,
  },
  pro: {
    planId: process.env.MERCADO_PAGO_PLAN_PRO_ID!,
    name: "Pro",
    price: 4999,
  },
  business: {
    planId: process.env.MERCADO_PAGO_PLAN_BUSINESS_ID!,
    name: "Business",
    price: 9999,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const { plan } = req.body;

    // Free plan — no checkout needed
    if (plan === "free") {
      await prisma.user.update({
        where: { id: userId },
        data: { subscription_plan: "free", subscription_status: "active" },
      });
      return res.status(200).json({ success: true, plan: "free", url: "/dashboard" });
    }

    const planConfig = MP_PLANS[plan as keyof typeof MP_PLANS];
    if (!planConfig) {
      return res.status(400).json({ error: "Plan inválido" });
    }

    // Get user email for preapproval
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Create MP preapproval (suscripción) linked to plan
    const mpRes = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preapproval_plan_id: planConfig.planId,
        payer_email: user.email,
        reason: `WhatsApp Bot SaaS - Plan ${planConfig.name}`,
        external_reference: `${userId}|${plan}`,
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?plan=${plan}&status=success`,
        status: "pending",
      }),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok || !mpData.init_point) {
      console.error("MP preapproval error:", mpData);
      return res.status(500).json({ error: "Error al crear la suscripción en MercadoPago" });
    }

    return res.status(200).json({
      success: true,
      url: mpData.init_point,
      preapprovalId: mpData.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
