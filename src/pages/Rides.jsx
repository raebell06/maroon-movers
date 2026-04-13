import React, { useState } from 'react'
import Nav from '../components/Nav'
import Map from '../components/Map/Mapfile.jsx'
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
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState([])

  const TOMTOM_API_KEY = 'z6IEYnpb4ohOXgZZ7Dlc12rnZ9EuSaip'

  const searchAddresses = async (query, setSuggestions) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/rides/search-address?query=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      setSuggestions(data.results || [])
    } catch (error) {
      console.error('Error searching addresses:', error)
      setSuggestions([])
    }
  }

  const handleLocationSelect = (location, isPickup) => {
    const fullAddress = location.address.freeformAddress
    if (isPickup) {
      setPickup(fullAddress)
      setPickupSuggestions([])
    } else {
      setDropoff(fullAddress)
      setDropoffSuggestions([])
    }
  }

  const handleFind = () => {
    if (!pickup || !dropoff) {
      alert('Please enter both pickup and dropoff locations')
      return
    }
    alert(`Searching for ride from "${pickup}" to "${dropoff}")`)
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
          <div className="space-y-2 relative">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">From</label>
            <input
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value)
                searchAddresses(e.target.value, setPickupSuggestions)
              }}
              placeholder="Pickup location"
              className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400"
            />
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
              }}
              placeholder="Dropoff location"
              className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all placeholder:text-gray-400"
            />
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
        <div className="card p-0 overflow-hidden rounded-xl">
          <Map />
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
