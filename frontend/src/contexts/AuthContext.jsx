import { createContext, useContext, useState } from 'react'

const AuthContext = createContext({ isAuth: false, login: () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  )

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true')
    setIsAuth(true)
  }

  const logout = () => {
    localStorage.removeItem('isAuthenticated')
    setIsAuth(false)
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
