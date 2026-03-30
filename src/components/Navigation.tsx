import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
}

// Navbar
interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="font-bold text-xl text-gray-900">WhatsApp Bot</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Configuración"
            >
              ⚙️
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/auth/login');
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              🚪
            </button>
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                ☰
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sidebar
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const router = useRouter();

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Mis Bots', href: '/dashboard/bots', icon: '🤖' },
    { label: 'Conversaciones', href: '/dashboard/conversations', icon: '💬' },
    { label: 'Configuración', href: '/dashboard/settings', icon: '⚙️' },
    { label: 'Precios', href: '/pricing', icon: '💰' },
  ];

  const sidebarClasses = `
    fixed md:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white
    transform transition-transform duration-200 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        <div className="h-screen flex flex-col">
          {/* Logo */}
          <Link href="/dashboard" className="p-6 flex items-center gap-2 hover:bg-gray-800 transition-colors">
            <span className="text-2xl">🤖</span>
            <span className="font-bold">Bot Manager</span>
          </Link>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={onClose}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 space-y-3">
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-left"
            >
              <span>⚙️</span>
              <span>Configuración</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/auth/login');
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-300 hover:bg-red-900/20 transition-colors text-left"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Breadcrumbs
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
