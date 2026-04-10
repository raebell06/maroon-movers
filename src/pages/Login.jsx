import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState('')
  const [userType, setUserType] = useState('user') // 'user' or 'driver'
  const navigate = useNavigate()
  const { login } = useAuth()

  const validateAamuEmail = (em) => {
    return /^[A-Za-z0-9._%+-]+@bulldogs\.aamu\.edu$/i.test(em.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email || !password) {
      setError('Please fill in both fields.')
      setLoading(false)
      return
    }

    if (!validateAamuEmail(email)) {
      setError('Use your Alabama A&M email (example@bulldogs.aamu.edu).')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: userType })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Save token and user
      login(data.user, data.token)
      navigate('/rides')
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    }

    setLoading(false)
  }

  const handleForgotPassword = async () => {
    setForgotMessage('')
    setForgotLoading(true)

    if (!email) {
      setForgotMessage('Please enter your email address first.')
      setForgotLoading(false)
      return
    }

    if (!validateAamuEmail(email)) {
      setForgotMessage('Use your Alabama A&M email (example@bulldogs.aamu.edu).')
      setForgotLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setForgotMessage('Password reset email sent! Check your inbox.')
      } else {
        setForgotMessage(data.error || 'Failed to send reset email.')
      }
    } catch (err) {
      setForgotMessage('Network error. Please try again.')
      console.error(err)
    }

    setForgotLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-maroon-50 to-maroon-100">
      <div className="max-w-sm w-full card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">🚗</div>
          <h1 className="text-3xl font-bold text-maroon-700">Maroon Moves</h1>
          <p className="text-sm text-gray-500">Campus Carpool Service</p>
        </div>

        {/* User Type Selection */}
        <div className="flex gap-3 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setUserType('user')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              userType === 'user'
                ? 'bg-maroon-600 text-white'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🧑 Rider
          </button>
          <button
            type="button"
            onClick={() => setUserType('driver')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              userType === 'driver'
                ? 'bg-maroon-600 text-white'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🚙 Driver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">AAMU Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bulldogs.aamu.edu"
              className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-maroon-300 transition-all"
            />
          </div>

          {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}

          <button type="submit" className="btn-maroon w-full py-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-sm text-maroon-600 hover:text-maroon-700 font-medium"
            disabled={forgotLoading}
          >
            {forgotLoading ? 'Sending...' : 'Forgot your password?'}
          </button>

          {forgotMessage && <div className="text-sm text-blue-500 bg-blue-50 p-3 rounded-lg">{forgotMessage}</div>}
        </form>

        <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-maroon-700 font-semibold hover:text-maroon-800 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

