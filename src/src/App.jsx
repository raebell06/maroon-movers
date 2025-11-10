import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Rides from './pages/Rides'
import Trips from './pages/Trips'
import SignUp from './pages/SignUp'
import { AuthProvider, useAuth } from './utils/auth'

// Protected route wrapper
function Protected({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-maroon-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Navigate to="/rides" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/rides" element={<Protected><Rides /></Protected>} />
          <Route path="/trips" element={<Protected><Trips /></Protected>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
