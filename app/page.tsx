import Link from 'next/link'

export default function Home() {
  return (
    <main className="page-container pattern-bg">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
            BleuApp
          </h1>
          <div className="h-1 w-32 bg-white mx-auto"></div>
        </div>

        {/* Main Card */}
        <div className="card space-y-8">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold leading-tight" style={{ color: '#1d4ed8' }}>
              Rejoignez la plateforme automatisée N°1 pour copier les trades de l'élite francophone.
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/auth/signup" 
              className="btn btn-primary w-full flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              Rejoindre BleuApp
            </Link>

            <Link 
              href="/auth/login" 
              className="btn btn-primary w-full flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
              </svg>
              Se connecter
            </Link>


          </div>

          <div className="text-center text-sm opacity-75 pt-4" style={{ color: '#1d4ed8' }}>
            <p>Rejoignez la communauté de trading francophone</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="fixed top-10 left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="fixed bottom-10 right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>
    </main>
  )
}

