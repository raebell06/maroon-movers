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
    const u = { email, name: email.split('@')[0] }
    login(u)
    navigate('/rides')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-maroon-700 text-center">Maroon Moves</h1>
        <p className="text-sm text-gray-600 text-center mb-4">Campus Carpool</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">AAMU Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bulldogs.aamu.edu"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <button type="submit" className="btn-maroon w-2/3 text-center">
              Login
            </button>
            <button
              type="button"
              onClick={() => alert('Password reset flow: stub')}
              className="text-sm text-maroon-700"
            >
              Forgot?
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() =>
                alert(
                  'Sign up flow: for the demo we require an email address with @bulldogs.aamu.edu'
                )
              }
              className="text-maroon-700 font-medium"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
