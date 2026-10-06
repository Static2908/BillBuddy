import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('billbuddy_user')) || null
    } catch {
      return null
    }
  })

  const login = (authResponse) => {
    localStorage.setItem('billbuddy_token', authResponse.token)
    localStorage.setItem('billbuddy_user', JSON.stringify(authResponse.user))
    setUser(authResponse.user)
  }

  const logout = () => {
    localStorage.removeItem('billbuddy_token')
    localStorage.removeItem('billbuddy_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout, isAuthenticated: Boolean(user) }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
