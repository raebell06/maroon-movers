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
    <div className="min-h-screen bg-maroon-700">
      <Nav className="bg-maroon-700" />
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-maroon-700">Welcome, {user?.name}</h2>
              <p className="text-sm text-gray-600">Where are you going today?</p>
            </div>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-500 border px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup address"
              className="w-full rounded-lg border p-2"
            />
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Dropoff address"
              className="w-full rounded-lg border p-2"
            />
            <div className="flex gap-2">
              <button onClick={handleFind} className="btn-maroon flex-1">
                Find a Ride
              </button>
              <Link to="/trips" className="px-4 py-2 rounded-2xl text-maroon-700 bg-maroon-100 font-semibold">
                My Trips
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 text-white">
          <div className="bg-maroon-800 rounded-xl p-3">
            <h3 className="font-semibold">Map</h3>
            <div className="mt-3 h-40 rounded-md bg-white/30 flex items-center justify-center">
              <span className="text-white/90">Map placeholder — integrate Google/Mapbox</span>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-white font-semibold">Recent Activity</h4>
            <ul className="mt-2 space-y-2">
              {recentMock.map(r => (
                <li key={r.id} className="bg-white/10 p-3 rounded-md flex justify-between">
                  <div>
                    <div className="font-medium">{r.label}</div>
                    <div className="text-xs text-white/80">{r.time}</div>
                  </div>
                  <button className="text-sm text-white/90">View</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
