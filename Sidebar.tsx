'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Prospects', href: '/prospects' },
    { name: 'Call Log', href: '/calls' },
    { name: 'Sales Scripts', href: '/scripts' },
  ];

  return (
    <div className={`flex h-full flex-col bg-gray-800 ${className}`}>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-shrink-0 items-center px-4 py-5">
          <h1 className="text-xl font-bold text-white">Gutter Supply CRM</h1>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 bg-gray-700 p-4">
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-white">Rain Gutter Supply</p>
              <p className="text-xs font-medium text-gray-300">Prospect Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
