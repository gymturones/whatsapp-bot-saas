import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { NextApiResponse } from 'next';

// Response helpers (also exported from @/middleware/auth)
export function sendError(res: NextApiResponse, error: unknown, status: number = 500) {
  console.error('API Error:', error);
  res.status(status).json({
    error: error instanceof Error ? error.message : 'Error interno',
  });
}

export function sendSuccess<T>(res: NextApiResponse, data: T, status: number = 200) {
  res.status(status).json({
    success: true,
    data,
  });
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// JWT
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// API Key
export function generateApiKey(): string {
  return `sk_${crypto.randomBytes(32).toString('hex')}`;
}

// Hashing (para API keys)
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// Validation
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Formatting
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Rate limiting helper
export const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 min
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count < maxRequests) {
    record.count++;
    return true;
  }

  return false;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export function getPaginationParams(
  query: any,
  defaultLimit: number = 10
): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(Math.max(1, parseInt(query.limit) || defaultLimit), 100);

  return { page, limit };
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

// Response formatting
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function formatPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

// Error types
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'No encontrado') {
    super(404, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'No autorizado') {
    super(401, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validación fallida') {
    super(400, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflicto') {
    super(409, message);
  }
}

// Retry logic
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Retry exhausted');
}

// Environment helpers
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue || '';
}
