import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Tipo de usuario autenticado
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

// Tipos de respuesta
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

// Middleware para verificar autenticación
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (typeof decoded === 'object' && 'userId' in decoded) {
      return decoded.userId as string;
    }
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
    return null;
  }

  return null;
}

// Wrapper para rutas protegidas
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

// Verificar método HTTP
export function withMethod(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  methods: string[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.method || !methods.includes(req.method)) {
      res.status(405).json({ error: 'Método no permitido' });
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

// Validar input con Zod
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
        error: error.errors?.[0]?.message || 'Validación fallida',
        issues: error.errors,
      });
    }
  };
}

// Combinar middlewares
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
    // Check method
    if (options.methods && req.method && !options.methods.includes(req.method)) {
      res.status(405).json({ error: 'Método no permitido' });
      return;
    }

    // Check auth
    let userId: string | null = null;
    if (options.auth) {
      userId = await requireAuth(req, res);
      if (!userId) return;
    }

    // Validate input
    if (options.validation) {
      try {
        const validated = options.validation.parse(req.body);
        req.body = validated;
      } catch (error: any) {
        res.status(400).json({
          error: error.errors?.[0]?.message || 'Validación fallida',
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

// Error handler
export function sendError(res: NextApiResponse, error: any, status: number = 500) {
  console.error('API Error:', error);
  res.status(status).json({
    error: error instanceof Error ? error.message : 'Error interno',
  });
}

// Success handler
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
