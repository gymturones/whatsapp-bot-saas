import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSupabaseServerClient } from '@/lib/supabase';

interface AuthUser {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      userId?: string;
    }
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string | null> {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token requerido' });
    return null;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (!error && user) {
      return user.id;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return decoded.userId as string;
    }
  } catch (error) {
    res.status(401).json({ error: 'Token invalido o expirado' });
    return null;
  }

  return null;
}

export function withAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string
  ) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = await requireAuth(req, res);
    if (!userId) return;

    try {
      await handler(req, res, userId);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Error interno',
      });
    }
  };
}

export function withMethod(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  methods: string[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.method || !methods.includes(req.method)) {
      res.status(405).json({ error: 'Metodo no permitido' });
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Error interno',
      });
    }
  };
}

export function withValidation<T>(
  schema: any,
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    data: T
  ) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const validated = schema.parse(req.body);
      await handler(req, res, validated);
    } catch (error: any) {
      res.status(400).json({
        error: error.errors?.[0]?.message || 'Validacion fallida',
        issues: error.errors,
      });
    }
  };
}

export function withMiddleware(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    userId?: string
  ) => Promise<void> | void,
  options: {
    auth?: boolean;
    methods?: string[];
    validation?: any;
  } = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (options.methods && req.method && !options.methods.includes(req.method)) {
      res.status(405).json({ error: 'Metodo no permitido' });
      return;
    }

    let userId: string | null = null;
    if (options.auth) {
      userId = await requireAuth(req, res);
      if (!userId) return;
    }

    if (options.validation) {
      try {
        const validated = options.validation.parse(req.body);
        req.body = validated;
      } catch (error: any) {
        res.status(400).json({
          error: error.errors?.[0]?.message || 'Validacion fallida',
        });
        return;
      }
    }

    try {
      await handler(req, res, userId || undefined);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Error interno',
      });
    }
  };
}

export function sendError(res: NextApiResponse, error: any, status: number = 500) {
  console.error('API Error:', error);
  res.status(status).json({
    error: error instanceof Error ? error.message : 'Error interno',
  });
}

export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  status: number = 200
) {
  res.status(status).json({
    success: true,
    data,
  });
}
