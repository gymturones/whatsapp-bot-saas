// src/lib/supabase.ts

import { createClient } from "@supabase/supabase-js";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { PrismaClient } from "@prisma/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Prisma client singleton — applies in all environments to prevent connection pool exhaustion
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
globalForPrisma.prisma = prisma;

// Browser client (public)
export function getSupabaseBrowserClient() {
  return createPagesBrowserClient();
}

// Server client (for API routes — use service role or anon key)
export function getSupabaseServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Service role client (admin operations)
export function getSupabaseServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Auth helpers
export async function getCurrentUser() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const supabase = getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Sign up
export async function signUp(email: string, password: string, name: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
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
export async function signOut() {
  const supabase = getSupabaseServerClient();
  return await supabase.auth.signOut();
}

// Sign in with OAuth
export async function signInWithOAuth(provider: "github" | "google") {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  return { data, error };
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
export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}
