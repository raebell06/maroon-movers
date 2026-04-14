import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Trips() {
  const { user, token } = useAuth()
  const [q, setQ] = useState('')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      fetchTrips()
    }
  }, [token])

  const fetchTrips = async () => {
    setLoading(true)
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
    setLoading(false)
  }

  const filtered = trips.filter(t => 
    t.pickup.toLowerCase().includes(q.toLowerCase()) || 
    t.dropoff.toLowerCase().includes(q.toLowerCase())
  )

  const totalSpent = trips.reduce((s, t) => s + (t.price || 0), 0)
  const totalTrips = trips.length

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-maroon-50 to-maroon-100 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-maroon-700">Your Trips</h1>
            <p className="text-gray-600">Review ride history, search requests, and track your total spend.</p>
          </div>

          <div className="card p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-maroon-700">Trips for {user?.name}</h2>
                <p className="text-sm text-gray-600">Total trips: {totalTrips} • Spent: ${totalSpent.toFixed(2)}</p>
              </div>
              <Link to="/rides" className="btn-secondary text-center">
                Back to Rides
              </Link>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Search Trips</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by pickup or dropoff"
                className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
              />
            </div>

            {filtered.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{loading ? 'Loading...' : 'No trips found.'}</p>
            ) : (
              <div className="space-y-4">
                {filtered.map((t) => (
                  <div key={t.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{t.pickup} → {t.dropoff}</h3>
                        <p className="text-sm text-gray-500 mt-1">{new Date(t.created_at).toLocaleDateString()} • {t.status}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500">Fare</p>
                        <p className="font-semibold text-maroon-600">${t.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
