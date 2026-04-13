import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import Map from '../components/Map/Mapfile.jsx'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Rides() {
  const { user, logout, token } = useAuth()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [price, setPrice] = useState('5')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      fetchTrips()
    }
  }, [token])

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rides/?role=rider`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTrips(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleFind = async () => {
    if (!pickup || !dropoff) {
      alert('Please fill in both locations')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/rides/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pickup, dropoff, price: parseFloat(price) })
      })

      if (res.ok) {
        const newTrip = await res.json()
        setTrips([newTrip, ...trips])
        setPickup('')
        setDropoff('')
        setMessage('Ride request sent!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <><div className="min-h-screen bg-linear-to-b from-maroon-700 to-maroon-800 flex flex-col" /><Nav className="bg-maroon-700" /><div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4">
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
        <div className="space-y-2 relative">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">From</label>
          <input
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value)
              searchAddresses(e.target.value, setPickupSuggestions)
            } }
            placeholder="Pickup location"
            className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400" />
          {pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 border border-gray-200 rounded-lg bg-white max-h-48 overflow-y-auto z-10 mt-1 shadow-lg">
              {pickupSuggestions.map((suggestion, i) => (
                <div
                  key={i}
                  onClick={() => handleLocationSelect(suggestion, true)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 text-sm text-gray-700"
                >
                  {suggestion.address.freeformAddress}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 relative">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">To</label>
          <input
            value={dropoff}
            onChange={(e) => {
              setDropoff(e.target.value)
              searchAddresses(e.target.value, setDropoffSuggestions)
            } }
            placeholder="Dropoff location"
            className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400" />
          {dropoffSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 border border-gray-200 rounded-lg bg-white max-h-48 overflow-y-auto z-10 mt-1 shadow-lg">
              {dropoffSuggestions.map((suggestion, i) => (
                <div
                  key={i}
                  onClick={() => handleLocationSelect(suggestion, false)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 text-sm text-gray-700"
                >
                  {suggestion.address.freeformAddress}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. Price ($)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="5"
            className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400" />
        </div>

        {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>}

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button onClick={handleFind} disabled={loading} className="btn-maroon flex-1 py-3 rounded-xl">
            {loading ? 'Searching...' : 'Find a Ride'}
          </button>
          <Link to="/trips" className="btn-secondary flex-1 py-3 rounded-xl text-center">
            My Trips
          </Link>
        </div>
      </div>

      {/* Map Section */}
      <div className="card bg-linear-to-br from-maroon-600 to-maroon-700 p-5 space-y-3">
        <h3 className="font-bold text-white text-lg">📍 Map</h3>
        <div className="h-48 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
          <span className="text-white/60 text-sm text-center px-4">Map placeholder — integrate Google/Mapbox</span>
        </div>
        <div className="card p-0 overflow-hidden rounded-xl">
          <Map />
        </div>

        {/* Recent Activity / My Requests */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-lg px-1">🚗 Your Requests</h4>
          <div className="space-y-2">
            {trips.length === 0 ? (
              <div className="card p-4 text-white/60 text-sm">No ride requests yet.</div>
            ) : (
              trips.map(t => (
                <div key={t.id} className="card p-4 bg-maroon-600/20 border-maroon-500/30 flex items-center justify-between hover:bg-maroon-600/30 transition-colors cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">{t.pickup} → {t.dropoff}</div>
                    <div className="text-xs text-white/60 mt-0.5">${t.price} • {t.status}</div>
                  </div>
                  <button className="text-sm font-medium text-maroon-200 hover:text-white transition-colors">View</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div></>
  )
}