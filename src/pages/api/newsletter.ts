// src/pages/api/newsletter.ts
// Guarda emails de interesados en la base de datos

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    // Log como audit entry (reuse AuditLog table)
    await prisma.auditLog.create({
      data: {
        action: "newsletter_signup",
        resource_type: "newsletter",
        resource_id: email,
        metadata: { email, source: "landing_page", date: new Date().toISOString() },
      },
    });

    return res.status(200).json({ success: true, message: "¡Te anotamos! Te avisamos cuando haya novedades." });
  } catch (error) {
    console.error("Newsletter error:", error);
    // Don't fail silently — still 200 so UX doesn't break
    return res.status(200).json({ success: true });
  }
}
