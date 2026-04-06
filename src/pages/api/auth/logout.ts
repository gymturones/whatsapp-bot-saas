// src/pages/api/auth/logout.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    const supabase = getSupabaseServerClient();

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
