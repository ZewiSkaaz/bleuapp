'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="shadow-2xl border-b border-white border-opacity-10" style={{ backgroundColor: '#1d4ed8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'} className="text-3xl font-black text-white tracking-tight">
              BleuApp
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAdmin ? (
              <>
                <Link href="/admin/dashboard" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all">
                  Dashboard
                </Link>
                <Link href="/admin/mt5-accounts" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all">
                  Comptes MT5
                </Link>
                <Link href="/admin/copy-trading" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all">
                  Copy Trading
                </Link>
                <Link href="/admin/users" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all hidden lg:block">
                  Users
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all hidden sm:block">
                  Dashboard
                </Link>
                <Link href="/mt5-accounts" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all">
                  MT5
                </Link>
                <Link href="/telegram-channels" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all">
                  Canaux
                </Link>
                <Link href="/subscription" className="text-white hover:text-white hover:opacity-80 font-bold px-3 py-2 rounded-lg transition-all">
                  Abo
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-gray-100 font-bold px-5 py-2 rounded-full transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
              style={{ color: '#1d4ed8' }}
            >
              🚪 Déco
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
