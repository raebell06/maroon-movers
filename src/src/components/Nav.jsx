import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav({ className = '' }) {
  return (
    <nav className={`w-full p-4 flex items-center justify-between ${className}`}>
      <Link to="/rides" className="text-white font-bold text-lg">
        Maroon Moves
      </Link>
      <div className="flex gap-2">
        <Link to="/rides" className="text-sm text-white/90">Rides</Link>
        <Link to="/trips" className="text-sm text-white/90">Trips</Link>
      </div>
    </nav>
  )
}
