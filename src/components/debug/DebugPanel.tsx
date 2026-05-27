'use client'
import { useState, useEffect } from 'react'

export default function DebugPanel() {
  const [show, setShow] = useState(false)
  const [viewport, setViewport] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        setShow(p => !p)
      }
      if (e.altKey && e.key === 'o') {
        document.body.classList.toggle('debug-outline')
      }
    }
    window.addEventListener('keydown', handler)
    
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('keydown', handler)
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  const breakpoint = 
    viewport.w < 640 ? 'xs (mobile)' :
    viewport.w < 768 ? 'sm' :
    viewport.w < 1024 ? 'md (tablet)' :
    viewport.w < 1280 ? 'lg (desktop)' : 'xl+'

  return (
    <>
      {/* Toggle button — fixed bottom right */}
      <button
        id="debug-btn"
        onClick={() => setShow(p => !p)}
        className="fixed bottom-4 right-4 z-[9999] bg-black text-white text-xs px-3 py-2 rounded-full opacity-70 hover:opacity-100 font-mono"
      >
        {show ? '✕ debug' : '🐛 debug'}
      </button>

      {show && (
        <div className="fixed bottom-14 right-4 z-[9999] bg-black/90 text-green-400 text-xs font-mono p-4 rounded-xl space-y-1 min-w-[200px]">
          <p className="text-white font-bold mb-2">Debug Panel</p>
          <p>Viewport: {viewport.w} × {viewport.h}px</p>
          <p>Breakpoint: <span className="text-yellow-400">{breakpoint}</span></p>
          <p>Device: {viewport.w < 768 ? '📱 Mobile' : viewport.w < 1024 ? '📱 Tablet' : '🖥️ Desktop'}</p>
          <hr className="border-white/20 my-2" />
          <p className="text-white/60 text-[10px]">Alt+D: toggle panel</p>
          <p className="text-white/60 text-[10px]">Alt+G: toggle grid</p>
          <p className="text-white/60 text-[10px]">Alt+O: toggle outline</p>
        </div>
      )}

      {/* Grid overlay toggle — press Alt+G */}
      <GridOverlay />
    </>
  )
}

function GridOverlay() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'g') setShow(p => !p)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      <div className="max-w-7xl mx-auto h-full px-4 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-full bg-blue-500/10 border-x border-blue-500/20" />
        ))}
      </div>
    </div>
  )
}
