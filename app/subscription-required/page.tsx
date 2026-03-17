'use client'
import Link from 'next/link'

export default function SubscriptionRequiredPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-xl">
        <h1 className="text-6xl font-black text-white">DEBUG MODE</h1>
        <p className="text-2xl text-yellow-400 font-bold">
          Si vous voyez cet écran, la version TEST est bien en ligne !
        </p>
        <Link href="/dashboard" className="btn btn-primary block text-center py-4 text-xl">
          🔓 ACCÉDER AU DASHBOARD (CLIQUEZ ICI)
        </Link>
        <div className="pt-12 text-white opacity-50 text-sm">
          ID de build : {new Date().getTime()}
        </div>
      </div>
    </div>
  )
}
