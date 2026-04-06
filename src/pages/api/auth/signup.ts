// src/pages/api/auth/signup.ts
// Handles user signup: creates user in Supabase Auth AND in Prisma User table

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma, getSupabaseServerClient } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, contraseña y nombre son requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const supabase = getSupabaseServerClient();

    // 1. Create user in Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError) {
      const msg = authError.message?.toLowerCase() || '';
      if (msg.includes('already registered') || msg.includes('user already exists')) {
        return res.status(409).json({ error: "Este email ya está registrado" });
      }
      return res.status(400).json({ error: authError.message });
    }

    // 2. Create user in Prisma User table
    // Use the Supabase user ID to link both records
    const userId = data.user?.id;

    if (userId) {
      try {
        await prisma.user.upsert({
          where: { id: userId },
          update: {
            email,
            name,
            email_verified: !data.user?.email_confirmed_at ? false : true,
          },
          create: {
            id: userId,
            email,
            name,
            email_verified: !data.user?.email_confirmed_at ? false : true,
            subscription_plan: "free",
            subscription_status: "active",
          },
        });
      } catch (dbError: any) {
        // If Prisma creation fails, log but don't block signup
        // The user exists in Supabase Auth, which is the source of truth for auth
        console.error("Failed to create Prisma user record:", dbError);

        // Try to create without upsert (in case of race condition)
        try {
          await prisma.user.create({
            data: {
              id: userId,
              email,
              name,
              subscription_plan: "free",
              subscription_status: "active",
            },
          });
        } catch {
          // If still fails, it likely already exists — continue
        }
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        email,
        name,
      },
      session: data.session ? {
        access_token: data.session.access_token,
      } : null,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
