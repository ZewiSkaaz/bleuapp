'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Terminal, 
  Users, 
  Zap, 
  Database,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items matching the La Centrale aesthetic
  const navItems = [
    { name: 'Control Center', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Membres & Accès', href: '/admin/users', icon: Users },
    { name: 'Canaux Telegram', href: '/admin/telegram-channels', icon: Zap },
    { name: 'Comptes Master (MT5)', href: '/admin/mt5-accounts', icon: Database },
    { name: 'Logs & Terminal', href: '/admin/logs', icon: Terminal },
    { name: 'Paramètres', href: '/admin/copy-trading', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20 md:pb-0 admin-page animate-fade-in">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          BleuApp Admin
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 h-full">
        {/* Global Header */}
        <header className="hidden md:flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
              Control Center
            </h1>
            <p className="text-slate-400 text-sm">Administration centralisée BleuApp & Bridge Telegram</p>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span>SaaS API: Stable</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span>Webhooks: Actifs</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          {/* Sidebar */}
          <aside className={`
            glass-panel flex flex-col gap-2 p-3 rounded-2xl border border-white/10 shadow-xl
            fixed md:relative top-[73px] md:top-0 left-0 w-full md:w-auto z-40 bg-[#1e293b]/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none
            transition-transform duration-300 ease-in-out h-[calc(100vh-73px)] md:h-auto overflow-y-auto
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
            
            <div className="my-2 border-t border-white/5"></div>
            
            <Link 
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 font-medium text-sm hover:bg-white/5 hover:text-white transition-all"
            >
              <HelpCircle size={18} />
              Quitter l'Admin
            </Link>
          </aside>

          {/* Main Content Area */}
          <main className="min-w-0 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
