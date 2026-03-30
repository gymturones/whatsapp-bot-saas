// src/pages/_app.tsx

import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Spinner } from '@/components/UI';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Verificar si la página necesita el layout del dashboard
  const isDashboardPage = router.pathname.startsWith('/dashboard') || 
                          router.pathname.startsWith('/pricing');

  useEffect(() => {
    setMounted(true);

    // Track page views
    const handleRouteChange = (url: string) => {
      console.log('Page changed to:', url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Aplicar layout del dashboard
  if (isDashboardPage) {
    return (
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
    );
  }

  // Sin layout (Auth pages, Landing page, etc.)
  return <Component {...pageProps} />;
}

export default MyApp;
