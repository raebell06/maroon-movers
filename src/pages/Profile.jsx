import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/auth'
import Nav from '../components/Nav'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', payment: '' })

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        payment: user.payment || ''
      })
    }
  }, [user])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const updated = { ...(user || {}), ...form }
    login(updated)
    alert('Profile saved locally.')
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
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
              <input
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
                placeholder="Card ending 4242"
              />
              <p className="text-xs text-gray-500 mt-1">Payment details are stored locally in this demo. Use a secure gateway in production.</p>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-maroon w-full py-3 rounded-xl">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
