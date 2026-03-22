import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks';
import { Navbar, Sidebar, Breadcrumbs } from './Navigation';
import { Spinner } from './UI';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs,
}) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // useAuth already redirects to login
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <div className="mb-6">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            )}

            {/* Page Title */}
            {title && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            )}

            {/* Children */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// HOC para aplicar layout automáticamente
export function withDashboardLayout<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    title?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
  }
) {
  return function LayoutComponent(props: P) {
    return (
      <DashboardLayout
        title={options?.title}
        breadcrumbs={options?.breadcrumbs}
      >
        <Component {...props} />
      </DashboardLayout>
    );
  };
}
