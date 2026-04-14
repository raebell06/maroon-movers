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
    <>
      <Nav />

      <div className="min-h-screen bg-linear-to-br from-maroon-50 to-maroon-100 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-maroon-700">Profile</h1>
            <p className="text-gray-600">Manage your account details and payment information.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-maroon-700">Account Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                    placeholder="you@bulldogs.aamu.edu"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-maroon-700">Payment Information</h2>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                <input
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300"
                  placeholder="Card ending 4242"
                />
                <p className="text-xs text-gray-500">Store payment method info here until Stripe is wired in.</p>
              </div>
            </div>

            {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
            {message && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</div>}

            <div className="pt-2">
              <button type="submit" className="btn-maroon w-full py-3" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
