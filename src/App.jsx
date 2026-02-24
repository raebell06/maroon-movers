import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Rides from './pages/Rides.jsx'
import Trips from './pages/Trips.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
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
      {/* Background */}
      <div className="min-h-screen flex justify-center bg-maroon-50 text-gray-900">
        {/* Mobile App Shell */}
        <div className="w-full max-w-[390px] min-h-screen bg-white shadow-xl rounded-3xl overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/rides" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/rides"
              element={
                <Protected>
                  <Rides />
                </Protected>
              }
            />
            <Route
              path="/trips"
              element={
                <Protected>
                  <Trips />
                </Protected>
              }
            />
            <Route
              path="/profile"
              element={
                <Protected>
                  <Profile />
                </Protected>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}
