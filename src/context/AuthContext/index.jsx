import { createContext, useContext, useState, useMemo } from 'react'

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Usuario Demo',
        rol: 'admin',
        isAuthenticated: true,
    })

    const login = userData => {
        setUser({ ...userData, isAuthenticated: true })
    }

    const logout = () => {
        setUser(prev => ({ ...prev, isAuthenticated: false }))
    }

    const value = useMemo(() => ({ user, login, logout }), [user])

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export { AuthProvider, useAuth }
