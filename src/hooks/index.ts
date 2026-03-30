import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSupabaseBrowserClient } from '@/lib/supabase';

// Helper: obtiene el token de Supabase desde localStorage
function getAuthToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('sb_access_token') || localStorage.getItem('token') || '';
}

// Fetch Hook — incluye Authorization header automáticamente
export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options?.headers || {}),
          },
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const json = await response.json();
        setData(json.data || json);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Mutation Hook
interface MutationOptions {
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useMutation<T>(url: string, options: MutationOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (payload?: any) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          method: options.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: payload ? JSON.stringify(payload) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}`);
        }

        const data = await response.json();
        options.onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido');
        setError(error.message);
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  return { mutate, loading, error };
}

// Auth Hook — usa la sesión de Supabase como fuente de verdad
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Guardar el token en localStorage para que useFetch y useMutation lo usen
        localStorage.setItem('sb_access_token', session.access_token);
        setUser(session.user);
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    localStorage.removeItem('sb_access_token');
    localStorage.removeItem('token');
    router.push('/auth/login');
  }, [router]);

  return { user, loading, logout };
}

// Form Hook
interface FormState {
  [key: string]: any;
}

interface FormOptions {
  initialValues: FormState;
  onSubmit: (values: FormState) => Promise<void>;
  onError?: (error: Error) => void;
}

export function useForm(options: FormOptions) {
  const [values, setValues] = useState(options.initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setValues((prev) => ({ ...prev, [name]: val }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        setLoading(true);
        await options.onSubmit(values);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido');
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [values, options]
  );

  const reset = useCallback(() => {
    setValues(options.initialValues);
    setErrors({});
    setTouched({});
  }, [options.initialValues]);

  return {
    values,
    errors,
    loading,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}

// Local Storage Hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Get
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}

// Debounce Hook
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Async Hook
export function useAsync<T, E>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}
