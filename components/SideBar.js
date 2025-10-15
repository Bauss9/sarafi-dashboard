'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '📊 Dashboard', icon: '📊' },
    { href: '/bookings', label: '📅 Buchungen', icon: '📅' },
    { href: '/calendar', label: '🗓️ Kalender', icon: '🗓️' },
  ];

  return (
    <div className="w-64 bg-black text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">DR. SARAFI</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded transition ${
              pathname === link.href
                ? 'bg-white text-black font-semibold'
                : 'hover:bg-gray-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}