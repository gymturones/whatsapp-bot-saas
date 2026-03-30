// src/pages/api/auth/me.ts
// Devuelve el usuario autenticado actual (basado en JWT del header Authorization)

import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/middleware/auth";
import { prisma } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = await requireAuth(req, res);
  if (!userId) return; // requireAuth already sent 401

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        subscription_plan: true,
        subscription_status: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Auth me error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}
