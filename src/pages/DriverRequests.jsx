import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function DriverRequests() {
  const { token } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      fetchRequests()
    }
  }, [token])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/rides/nearby`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      } else {
        setMessage('Failed to load ride requests')
      }
    } catch (err) {
      setMessage('Network error. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/api/rides/${requestId}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Ride request accepted successfully')
        setRequests((current) => current.filter((request) => request.id !== requestId))
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(data.error || 'Failed to accept ride request')
      }
    } catch (err) {
      setMessage('Network error. Please try again.')
      console.error(err)
    }
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-maroon-50 to-maroon-100 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-maroon-700">Ride Requests</h1>
            <p className="text-gray-600">Review pending rider requests and accept the ones you want to drive.</p>
          </div>

          <div className="card p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-maroon-700">Nearby Requests</h2>
                <p className="text-gray-600">Pending ride requests currently available to drivers.</p>
              </div>
              <button onClick={fetchRequests} className="btn-secondary" disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {message && (
              <div className={`text-sm p-3 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            {requests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{loading ? 'Loading requests...' : 'No pending ride requests right now.'}</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">{request.pickup} → {request.dropoff}</h3>
                        <p className="text-sm text-gray-500">Rider: {request.rider_name || 'Unknown rider'}</p>
                        <p className="text-sm text-gray-500">Requested: {new Date(request.created_at).toLocaleString()}</p>
                      </div>
                      <div className="md:text-right space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">Estimated Fare</p>
                          <p className="font-semibold text-maroon-600">${Number(request.price || 0).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="btn-maroon w-full md:w-auto"
                        >
                          Accept Request
                        </button>
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