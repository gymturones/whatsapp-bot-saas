// src/lib/supabase.ts
// Compatible con Next.js Pages Router (no usa next/headers)

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ─── Browser client (cliente) ─────────────────────────────────────────────────
export function getSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ─── Server client para API Routes (Pages Router) ────────────────────────────
// Acepta opcionalmente req/res para manejar cookies de sesión.
export function getSupabaseServerClient(
  req?: NextApiRequest,
  res?: NextApiResponse
): SupabaseClient {
  if (req && res) {
    // Con cookies de la request (para sesiones Supabase en API routes)
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          cookie: req.headers.cookie ?? "",
        },
      },
    });
  }
  // Sin cookies (operaciones genéricas)
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ─── Service role client (operaciones admin) ──────────────────────────────────
export function getSupabaseServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function getCurrentUser(req?: NextApiRequest, res?: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession(req?: NextApiRequest, res?: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Sign up
export async function signUp(email: string, password: string, name: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  return { data, error };
}

// Sign in
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Sign out
export async function signOut(req?: NextApiRequest, res?: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  return await supabase.auth.signOut();
}

// Reset password
export async function resetPassword(email: string) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  return { data, error };
}

// Update password
export async function updatePassword(newPassword: string, req?: NextApiRequest, res?: NextApiResponse) {
  const supabase = getSupabaseServerClient(req, res);
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}
