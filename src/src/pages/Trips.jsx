import React, { useState } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const tripsMock = [
  { id: 1, date: '2025-03-12', dest: 'Grocery', status: 'Completed', price: 3.5 },
  { id: 2, date: '2025-03-01', dest: 'Library', status: 'Completed', price: 2.0 },
  { id: 3, date: '2025-02-20', dest: 'Campus Center', status: 'Cancelled', price: 0 }
]

export default function Trips() {
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const filtered = tripsMock.filter(t => t.dest.toLowerCase().includes(q.toLowerCase()))

  const totalSpent = tripsMock.reduce((s, t) => s + t.price, 0)
  const totalTrips = tripsMock.length

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
            <Link to="/rides" className="text-sm text-maroon-700">Back to Rides</Link>
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
            {filtered.map(t => (
              <li key={t.id} className="p-3 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{t.dest}</div>
                    <div className="text-xs text-gray-500">{t.date} • {t.status}</div>
                  </div>
                  <div className="text-sm font-medium">${t.price.toFixed(2)}</div>
                </div>
              </li>
            ))}
            {filtered.length === 0 && <li className="text-sm text-gray-500">No trips found.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
