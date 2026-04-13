import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function DriverRides() {
  const { user, logout, token } = useAuth()
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [departureTime, setDepartureTime] = useState('')
  const [availableSeats, setAvailableSeats] = useState('3')
  const [pricePerSeat, setPricePerSeat] = useState('5')
  const [myRides, setMyRides] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      fetchMyRides()
    }
  }, [token])

  const fetchMyRides = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rides/?role=driver`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setMyRides(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateRide = async () => {
    if (!departure || !destination || !departureTime || !availableSeats || !pricePerSeat) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/rides/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          departure,
          destination,
          departureTime,
          availableSeats: parseInt(availableSeats),
          pricePerSeat: parseFloat(pricePerSeat)
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Ride created successfully!')
        setDeparture('')
        setDestination('')
        setDepartureTime('')
        setAvailableSeats('3')
        setPricePerSeat('5')
        setTimeout(() => setMessage(''), 3000)
        fetchMyRides()
      } else {
        setMessage(data.error || 'Failed to create ride')
      }
    } catch (err) {
      setMessage('Network error. Please try again.')
      console.error(err)
    }

    setLoading(false)
  }

  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return

    try {
      const res = await fetch(`${API_URL}/api/rides/${rideId}/cancel`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        setMessage('Ride cancelled successfully')
        setTimeout(() => setMessage(''), 3000)
        fetchMyRides()
      } else {
        setMessage('Failed to cancel ride')
      }
    } catch (err) {
      setMessage('Network error. Please try again.')
      console.error(err)
    }
  }

  return (
    <>
      <Nav user={user} logout={logout} />
      <div className="min-h-screen bg-linear-to-br from-maroon-50 to-maroon-100 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-maroon-700">Driver Dashboard</h1>
            <p className="text-gray-600">Manage your rides and passengers</p>
          </div>

          {/* Create New Ride */}
          <div className="card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-maroon-700">Create a New Ride</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Departure Location</label>
                <input
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  placeholder="e.g., Campus Parking Lot A"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Destination</label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Downtown Station"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Departure Time</label>
                <input
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Available Seats</label>
                <select
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Seat' : 'Seats'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Price Per Seat ($)</label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={pricePerSeat}
                  onChange={(e) => setPricePerSeat(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                />
              </div>
            </div>

            {message && (
              <div className={`text-sm p-3 rounded-lg ${message.includes('success') || message.includes('successfully') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            <button
              onClick={handleCreateRide}
              className="btn-maroon w-full py-3"
              disabled={loading}
            >
              {loading ? 'Creating Ride...' : 'Create Ride'}
            </button>
          </div>

          {/* My Active Rides */}
          <div className="card p-8 space-y-6">
            <h2 className="text-2xl font-bold text-maroon-700">My Active Rides</h2>

            {myRides.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active rides. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {myRides.map((ride) => (
                  <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{ride.departure} → {ride.destination}</h3>
                        <p className="text-sm text-gray-500">📅 {new Date(ride.departureTime).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleCancelRide(ride.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Available Seats</p>
                        <p className="font-semibold text-maroon-600">{ride.availableSeats}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price Per Seat</p>
                        <p className="font-semibold text-maroon-600">${ride.pricePerSeat}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Passengers</p>
                        <p className="font-semibold text-maroon-600">{ride.passengerCount || 0}/{ride.availableSeats}</p>
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
