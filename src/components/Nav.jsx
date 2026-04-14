import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Nav({ className = '' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isDriver = user?.role === 'driver'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={`w-full px-4 py-3 flex items-center justify-between border-b border-white/10 ${className}`}>
      <Link to={isDriver ? '/driver/rides' : '/rides'} className="text-white font-bold text-xl tracking-tight">
        🚗 Maroon Moves
      </Link>
      <div className="flex gap-4 items-center">
        {isDriver ? (
          <>
            <Link to="/driver/rides" className="text-sm text-white/80 hover:text-white transition-colors">Rides</Link>
            <Link to="/driver/profile" className="text-sm text-white/80 hover:text-white transition-colors">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/rides" className="text-sm text-maroon-700 hover:text-white transition-colors">Rides</Link>
            <Link to="/trips" className="text-sm text-maroon-700 hover:text-white transition-colors">Trips</Link>
            <Link to="/profile" className="text-sm text-maroon-700 hover:text-white transition-colors">Profile</Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="text-sm text-white/80 hover:text-white transition-colors font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
