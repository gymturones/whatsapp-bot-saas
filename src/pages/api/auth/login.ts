// src/pages/api/auth/login.ts
// Handles user login: authenticates via Supabase, ensures User exists in Prisma

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma, getSupabaseServerClient } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const supabase = getSupabaseServerClient();

    // 1. Authenticate via Supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const userId = data.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Error de autenticación" });
    }

    // 2. Ensure User exists in Prisma (create if missing — handles legacy accounts)
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email_verified: true,
        },
        create: {
          id: userId,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email_verified: true,
          subscription_plan: "free",
          subscription_status: "active",
        },
      });
    } catch (dbError: any) {
      console.error("Failed to sync Prisma user on login:", dbError);
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
      access_token: data.session?.access_token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
