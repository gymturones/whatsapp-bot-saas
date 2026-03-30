import React from 'react';
import { Card, Button, Alert } from './UI';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <Card className="max-w-md">
            <div className="space-y-4">
              <div className="text-4xl text-center">⚠️</div>
              <h1 className="text-2xl font-bold text-center">Algo salió mal</h1>
              <p className="text-gray-600 text-center">
                Disculpa, encontramos un error inesperado.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Alert variant="error">
                  <p className="font-mono text-xs break-words">
                    {this.state.error.toString()}
                  </p>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    this.setState({
                      hasError: false,
                      error: null,
                      errorInfo: null,
                    });
                  }}
                >
                  Intentar de Nuevo
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => window.location.href = '/'}
                >
                  Ir al Inicio
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para capturar errores en funciones async
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
