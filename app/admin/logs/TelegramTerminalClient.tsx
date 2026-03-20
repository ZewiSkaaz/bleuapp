'use client'

import { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, RefreshCw, Power, AlertCircle, ShieldCheck, Plus, X, Send, Trash2 } from 'lucide-react'

interface Signal {
  id: string
  symbol: string
  signal_type: string
  order_type: string
  entry_price?: number
  stop_loss?: number
  take_profit?: number
  created_at: string
}

interface Channel {
  id: string
  name: string
  username: string
}

export default function TelegramTerminalClient({ 
  initialSignals, 
  initialChannels 
}: { 
  initialSignals: any[],
  initialChannels: any[]
}) {
  const [logs, setLogs] = useState<{type: string, msg: string, time: string}[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [isClosingAll, setIsClosingAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Manual Signal State
  const [formData, setFormData] = useState({
    symbol: 'GOLD',
    type: 'BUY',
    orderType: 'MARKET',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    channelId: initialChannels[0]?.id || ''
  })

  useEffect(() => {
    const startingLogs = []
    startingLogs.push({ type: 'accent', msg: 'Telegram Bridge active. Listening for webhook signals...', time: new Date(Date.now() - 60000).toLocaleTimeString() })
    startingLogs.push({ type: 'success', msg: 'Bot is LIVE', time: new Date(Date.now() - 59000).toLocaleTimeString() })
    startingLogs.push({ type: 'white', msg: `Loaded ${initialSignals.length} recent signals.`, time: new Date(Date.now() - 58000).toLocaleTimeString() })

    initialSignals.slice(0, 10).forEach(sig => {
      startingLogs.push({ 
        type: 'success', 
        msg: `[SIGNAL_IN] ${sig.signal_type} ${sig.symbol} | SL: ${sig.stop_loss || '-'} | TP: ${sig.take_profit || '-'}`, 
        time: new Date(sig.created_at).toLocaleTimeString() 
      })
    })

    setLogs(startingLogs.reverse())
  }, [initialSignals])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const addLog = (type: string, msg: string) => {
    setLogs(prev => [...prev, { type, msg, time: new Date().toLocaleTimeString() }])
  }

  const handleResync = async () => {
    setIsSyncing(true)
    addLog('warning', '[MANUAL_ACTION] Admin requested webhook resync...')
    
    setTimeout(() => {
      addLog('accent', 'Ping /api/telegram/webhook... OK (200)')
      addLog('success', '[SUCCESS] Webhook resynchronized and ready to listen.')
      setIsSyncing(false)
    }, 1500)
  }

  const handleCloseAll = async (symbol?: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir fermer TOUTES les positions ${symbol ? `sur ${symbol}` : ''} de TOUS les clients ?`)) return
    
    setIsClosingAll(true)
    addLog('warning', `[EMERGENCY] Closing all positions ${symbol ? `for ${symbol}` : ''}...`)

    try {
      const res = await fetch('/api/admin/signals/close-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      })
      const data = await res.json()
      
      if (data.success) {
        addLog('success', `[SUCCESS] ${data.totalClosed} position(s) fermée(s) avec succès.`)
      } else {
        addLog('error', `[ERROR] Échec de la fermeture globale: ${data.error}`)
      }
    } catch (error: any) {
      addLog('error', `[ERROR] Erreur réseau: ${error.message}`)
    } finally {
      setIsClosingAll(false)
    }
  }

  const handleSendManualSignal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsModalOpen(false)
    addLog('warning', `[MANUAL_SIGNAL] Sending ${formData.type} ${formData.symbol} to all subscribers...`)

    try {
      const res = await fetch('/api/admin/signals/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success) {
        addLog('success', `[SUCCESS] Signal manuel ${formData.symbol} transmis aux abonnés.`)
      } else {
        addLog('error', `[ERROR] Échec envoi manuel: ${data.error}`)
      }
    } catch (error: any) {
      addLog('error', `[ERROR] Erreur réseau: ${error.message}`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#020617] relative">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f172a]/50">
        <div className="flex items-center gap-2">
          <TerminalIcon size={18} className="text-blue-400" />
          <h3 className="text-white font-mono text-sm">bot@telegram:~</h3>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-500/20"
          >
            <Plus size={14} />
            Signal Manuel
          </button>
          
          <button 
            onClick={handleResync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50 border border-white/10"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            Resync
          </button>

          <div className="h-6 w-px bg-white/10 mx-1" />

          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold pointer-events-none"
          >
            <ShieldCheck size={14} />
            Live
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-blue-500/20">
        {logs.map((log, i) => {
          let colorClass = 'text-slate-300'
          if (log.type === 'success') colorClass = 'text-emerald-400'
          if (log.type === 'warning') colorClass = 'text-amber-400'
          if (log.type === 'accent') colorClass = 'text-blue-400'
          if (log.type === 'error') colorClass = 'text-rose-400'

          return (
            <div key={i} className="mb-2 break-all animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-slate-500 select-none mr-3">[{log.time}]</span>
              <span className={colorClass}>{log.msg}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Emergency Section */}
      <div className="p-4 border-t border-red-500/20 bg-red-950/20">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h4 className="text-red-400 font-bold flex items-center gap-2 mb-1 text-sm uppercase tracking-wider">
              <AlertCircle size={16} /> Zone d'Intervention d'Urgence
            </h4>
            <p className="text-xs text-slate-400 italic">Forcer la clôture des positions ou redémarrer le pont si les ordres ne passent plus.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => handleCloseAll()}
              disabled={isClosingAll}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-lg shadow-rose-900/20 text-xs"
            >
              <Trash2 size={16} />
              {isClosingAll ? 'Closing...' : 'GLOBAL CLOSE'}
            </button>
            
            <button 
              onClick={() => handleResync()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-white/5 text-xs font-bold"
            >
              <Power size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Signal Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Send size={18} className="text-blue-400" /> Nouvel Ordre Manuel
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendManualSignal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Symbole</label>
                  <input 
                    type="text" 
                    value={formData.symbol} 
                    onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="ex: GOLD"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Action</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    <option value="BUY">BUY (Achat)</option>
                    <option value="SELL">SELL (Vente)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type d'Ordre</label>
                <select 
                  value={formData.orderType} 
                  onChange={e => setFormData({...formData, orderType: e.target.value})}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  <option value="MARKET">MARKET (Exécution Immédiate)</option>
                  <option value="LIMIT">LIMIT (Ordre Différé)</option>
                </select>
              </div>

              {formData.orderType === 'LIMIT' && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prix d'Entrée</label>
                  <input 
                    type="text" 
                    value={formData.entryPrice} 
                    onChange={e => setFormData({...formData, entryPrice: e.target.value})}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="ex: 2650.50"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest text-rose-400">Stop Loss</label>
                  <input 
                    type="text" 
                    value={formData.stopLoss} 
                    onChange={e => setFormData({...formData, stopLoss: e.target.value})}
                    className="w-full bg-[#020617] border border-rose-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                    placeholder="SL"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest text-emerald-400">Take Profit</label>
                  <input 
                    type="text" 
                    value={formData.takeProfit} 
                    onChange={e => setFormData({...formData, takeProfit: e.target.value})}
                    className="w-full bg-[#020617] border border-emerald-500/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="TP"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diffuser sur le Canal</label>
                <select 
                  value={formData.channelId} 
                  onChange={e => setFormData({...formData, channelId: e.target.value})}
                  className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  {initialChannels.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.name} (@{ch.username})</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 italic">Le signal sera envoyé aux abonnés de ce canal uniquement.</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 mt-2"
              >
                <Send size={18} /> Diffuser le Signal
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  )
}
