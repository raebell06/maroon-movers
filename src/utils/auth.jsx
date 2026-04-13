import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('mm_user')) || null
  )
  const [token, setToken] = useState(localStorage.getItem('mm_token') || null)

  const login = (userData, authToken) => {
    localStorage.setItem('mm_user', JSON.stringify(userData))
    localStorage.setItem('mm_token', authToken)
    setUser(userData)
    setToken(authToken)
  }

  const logout = () => {
    localStorage.removeItem('mm_user')
    localStorage.removeItem('mm_token')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

