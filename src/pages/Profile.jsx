import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import { useAuth } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Profile() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', payment_method: '' })
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
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setForm({
          name: data.name || '',
          email: data.email || '',
          password: '',
          payment_method: data.payment_method || ''
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
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Update failed')
      } else {
        setMessage('Profile saved successfully')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-maroon-700">
      <Nav className="bg-maroon-700" />

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-maroon-700">Profile</h2>
              <p className="text-sm text-gray-500">Manage your account details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
                placeholder="you@bulldogs.aamu.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
              <input
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
                placeholder="Card ending 4242"
              />
              <p className="text-xs text-gray-500 mt-1">Store payment method info here (integrate Stripe for real payment).</p>
            </div>

            {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
            {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>}

            <div className="pt-2">
              <button type="submit" className="btn-maroon w-full py-3 rounded-xl" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
