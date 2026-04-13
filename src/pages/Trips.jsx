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
    <div className="min-h-screen bg-maroon-700">
      <Nav className="bg-maroon-700" />
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-xl text-maroon-700">Trips — {user?.name}</h2>
              <p className="text-sm text-gray-600">Total trips: {totalTrips} • Spent: ${totalSpent.toFixed(2)}</p>
            </div>
            <Link to="/rides" className="text-sm text-maroon-700">Back</Link>
          </div>

          <div className="mt-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search your trips"
              className="w-full rounded-lg border p-2"
            />
          </div>

          <ul className="mt-4 space-y-3">
            {filtered.length === 0 ? (
              <li className="text-sm text-gray-500">{loading ? 'Loading...' : 'No trips found.'}</li>
            ) : (
              filtered.map(t => (
                <li key={t.id} className="p-3 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{t.pickup} → {t.dropoff}</div>
                      <div className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()} • {t.status}</div>
                    </div>
                    <div className="text-sm font-medium">${t.price.toFixed(2)}</div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
