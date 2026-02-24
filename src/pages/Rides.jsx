import React, { useState } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const recentMock = [
  { id: 1, label: 'Library → Dorm', time: 'Yesterday' },
  { id: 2, label: 'Grocery → Dorm', time: '2 days ago' }
]

export default function Rides() {
  const { user, logout } = useAuth()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')

  const handleFind = () => {
    alert(`Searching for ride from "${pickup}" to "${dropoff}" (mock)`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon-700 to-maroon-800 flex flex-col">
      <Nav className="bg-maroon-700" />
      
      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4">
        {/* Welcome Card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-maroon-700">Hey, {user?.name}! 👋</h2>
              <p className="text-sm text-gray-500 mt-1">Where are you headed?</p>
            </div>
            <button
              onClick={() => logout()}
              className="text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
            >
              Log out
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">From</label>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup location"
              className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">To</label>
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Dropoff location"
              className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button onClick={handleFind} className="btn-maroon flex-1 py-3 rounded-xl">
              Find a Ride
            </button>
            <Link to="/trips" className="btn-secondary flex-1 py-3 rounded-xl text-center">
              My Trips
            </Link>
          </div>
        </div>

        {/* Map Section */}
        <div className="card bg-gradient-to-br from-maroon-600 to-maroon-700 p-5 space-y-3">
          <h3 className="font-bold text-white text-lg">📍 Map</h3>
          <div className="h-48 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <span className="text-white/60 text-sm text-center px-4">Map placeholder — integrate Google/Mapbox</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-lg px-1">🕐 Recent Activity</h4>
          <div className="space-y-2">
            {recentMock.map(r => (
              <div key={r.id} className="card p-4 bg-maroon-600/20 border-maroon-500/30 flex items-center justify-between hover:bg-maroon-600/30 transition-colors cursor-pointer">
                <div>
                  <div className="font-semibold text-white">{r.label}</div>
                  <div className="text-xs text-white/60 mt-0.5">{r.time}</div>
                </div>
                <button className="text-sm font-medium text-maroon-200 hover:text-white transition-colors">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
