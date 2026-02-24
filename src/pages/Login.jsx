import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const validateAamuEmail = (em) => {
    return /^[A-Za-z0-9._%+-]+@bulldogs\.aamu\.edu$/i.test(em.trim())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please fill in both fields.')
    if (!validateAamuEmail(email)) {
      return setError('Use your Alabama A&M email (example@bulldogs.aamu.edu).')
    }
    // mock authentication success
    login({ email })
    navigate('/rides')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-maroon-50 to-maroon-100">
      <div className="max-w-sm w-full card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-2">🚗</div>
          <h1 className="text-3xl font-bold text-maroon-700">Maroon Moves</h1>
          <p className="text-sm text-gray-500">Campus Carpool Service</p>
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

          <button type="submit" className="btn-maroon w-full py-3">
            Log In
          </button>
          
          <button
            type="button"
            onClick={() => alert('Password reset flow: stub')}
            className="w-full text-sm text-maroon-600 hover:text-maroon-700 font-medium"
          >
            Forgot your password?
          </button>
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

