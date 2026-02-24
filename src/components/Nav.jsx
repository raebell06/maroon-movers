import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav({ className = '' }) {
  return (
    <nav className={`w-full px-4 py-3 flex items-center justify-between border-b border-white/10 ${className}`}>
      <Link to="/rides" className="text-white font-bold text-xl tracking-tight">
        🚗 Maroon Moves
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/rides" className="text-sm text-white/80 hover:text-white transition-colors">Rides</Link>
        <Link to="/trips" className="text-sm text-white/80 hover:text-white transition-colors">Trips</Link>
      </div>
    </nav>
  )
}
