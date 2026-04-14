import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import Map from '../components/Map/Mapfile.jsx'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY || 'z6IEYnpb4ohOXgZZ7Dlc12rnZ9EuSaip'

export default function Rides() {
  const { user, token } = useAuth()
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [price, setPrice] = useState('5')
  const [trips, setTrips] = useState([])
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [dropoffSuggestions, setDropoffSuggestions] = useState([])
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

  const searchAddresses = async (query, setSuggestions) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery || !TOMTOM_API_KEY) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(trimmedQuery)}.json?key=${TOMTOM_API_KEY}&limit=5`
      )

      if (!res.ok) {
        setSuggestions([])
        return
      }

      const data = await res.json()
      setSuggestions(data.results || [])
    } catch (err) {
      console.error(err)
      setSuggestions([])
    }
  }

  const handleLocationSelect = (suggestion, isPickup) => {
    const address = suggestion?.address?.freeformAddress || ''

    if (isPickup) {
      setPickup(address)
      setPickupSuggestions([])
      return
    }

    setDropoff(address)
    setDropoffSuggestions([])
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
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-maroon-50 to-maroon-100 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-maroon-700">Rider Dashboard</h1>
            <p className="text-gray-600">Request a ride and keep track of your recent trips</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <div className="card p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-maroon-700">Plan Your Ride</h2>
                <p className="text-gray-600">Hey, {user?.name}! Enter your pickup and dropoff to request a ride.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Pickup Location</label>
                  <input
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value)
                      searchAddresses(e.target.value, setPickupSuggestions)
                    }}
                    placeholder="e.g., Student Union"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
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

                <div className="space-y-2 relative md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Dropoff Location</label>
                  <input
                    value={dropoff}
                    onChange={(e) => {
                      setDropoff(e.target.value)
                      searchAddresses(e.target.value, setDropoffSuggestions)
                    }}
                    placeholder="e.g., Downtown Station"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
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

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Estimated Price ($)</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="5"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>
              </div>

              {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={handleFind} disabled={loading} className="btn-maroon flex-1 py-3">
                  {loading ? 'Searching...' : 'Find a Ride'}
                </button>
                <Link to="/trips" className="btn-secondary flex-1 py-3 text-center">
                  My Trips
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="card p-8 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-maroon-700">Map</h2>
                  <p className="text-gray-600">Preview the area around your route before you request a ride.</p>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <Map />
                </div>
              </div>

              <div className="card p-8 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-maroon-700">Your Requests</h2>
                  <p className="text-gray-600">Recent ride requests and their current status.</p>
                </div>

                {trips.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No ride requests yet.</p>
                ) : (
                  <div className="space-y-4">
                    {trips.map((t) => (
                      <div
                        key={t.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-800">{t.pickup} → {t.dropoff}</h3>
                            <p className="text-sm text-gray-500 mt-1">Status: {t.status}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Estimated Fare</p>
                            <p className="font-semibold text-maroon-600">${t.price}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}