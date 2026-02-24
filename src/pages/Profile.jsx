import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/auth'

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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Payment Method (card or token)</label>
          <input name="payment" value={form.payment} onChange={handleChange} className="mt-1 block w-full rounded border px-3 py-2" placeholder="Card ending 4242" />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full bg-maroon-600 text-white py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  )
}
