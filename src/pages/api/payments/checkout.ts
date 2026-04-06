// src/pages/api/payments/checkout.ts
// Checkout con MercadoPago Suscripciones (preapproval)

import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/supabase";

const MP_PLANS: Record<string, { planId: string; name: string; price: number }> = {
  starter: {
    planId: process.env.MERCADO_PAGO_PLAN_STARTER_ID || '5aee3efe01594aec93eade037360e7ed',
    name: "Starter",
    price: 10000,
  },
  pro: {
    planId: process.env.MERCADO_PAGO_PLAN_PRO_ID || 'd1233b2ebed2412d833817ead1641c28',
    name: "Pro",
    price: 25000,
  },
  business: {
    planId: process.env.MERCADO_PAGO_PLAN_BUSINESS_ID || '60be6d9eded5456d85350bd3d109cfd3',
    name: "Business",
    price: 35000,
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

    // Obtener el init_point del plan directamente desde MP (sin crear preapproval)
    const mpRes = await fetch(`https://api.mercadopago.com/preapproval_plan/${planConfig.planId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok || !mpData.init_point) {
      console.error("MP plan fetch error:", mpData);
      return res.status(500).json({ error: "Error al obtener el plan de MercadoPago" });
    }

    return res.status(200).json({
      success: true,
      url: mpData.init_point,
      planId: planConfig.planId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
