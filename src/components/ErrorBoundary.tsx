import React from 'react';
import { Button } from './UI';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-white">Algo salió mal</h1>
            <p className="text-slate-400">Disculpá, encontramos un error inesperado. Intentá recargar la página.</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => this.setState({ hasError: false, error: null })}>
                Intentar de nuevo
              </Button>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Ir al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
