import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function DriverProfile() {
  const { user, token, logout } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    carMake: '',
    carModel: '',
    carYear: '',
    licensePlate: '',
    bankAccount: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) {
      fetchProfile()
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/driver/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '',
          phoneNumber: data.phoneNumber || '',
          carMake: data.carMake || '',
          carModel: data.carModel || '',
          carYear: data.carYear || '',
          licensePlate: data.licensePlate || '',
          bankAccount: data.bankAccount || ''
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/driver/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Profile updated successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <>
      <Nav user={user} logout={logout} />
      <div className="min-h-screen bg-linear-to-br from-maroon-50 to-maroon-100 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-maroon-700 mb-2">Driver Profile</h1>
            <p className="text-gray-600">Manage your driver information and vehicle details</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-maroon-700">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@bulldogs.aamu.edu"
                    disabled
                    className="w-full rounded-lg border border-gray-200 p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="(334) 555-0123"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave empty to keep current password"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-maroon-700">Vehicle Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Car Make</label>
                  <input
                    type="text"
                    name="carMake"
                    value={form.carMake}
                    onChange={handleChange}
                    placeholder="Toyota"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Car Model</label>
                  <input
                    type="text"
                    name="carModel"
                    value={form.carModel}
                    onChange={handleChange}
                    placeholder="Camry"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Car Year</label>
                  <input
                    type="text"
                    name="carYear"
                    value={form.carYear}
                    onChange={handleChange}
                    placeholder="2022"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">License Plate</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={form.licensePlate}
                    onChange={handleChange}
                    placeholder="ABC1234"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-maroon-700">Banking Information</h2>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Bank Account</label>
                <input
                  type="text"
                  name="bankAccount"
                  value={form.bankAccount}
                  onChange={handleChange}
                  placeholder="Account number (last 4 digits shown for security)"
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                />
                <p className="text-xs text-gray-500">For receiving earnings from rides</p>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn-maroon w-full py-3" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
