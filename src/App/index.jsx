import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, UserCircle, Package, ShoppingCart, FileText, BarChart3, LogOut, Home } from 'lucide-react'
import Login from '@/pages/Login'
import AdminLayout from '@/components/layout/AdminLayout'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Dashboard from '@/pages/Dashboard'
import UsersList from '@/pages/Users/UsersList'
import CustomersList from '@/pages/Customers/CustomersList'
import ProductionList from '@/pages/Production/ProductionList'

const ProtectedRoute = ({ children })=>{
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to='/login' />
}

// Componente principal
const App = () => {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="usuarios" element={<UsersList />} />
            <Route path="clientes" element={<CustomersList />} />
            <Route path="maquila" element={<ProductionList />} />

            {/* Más rutas... */}

             {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
} 

export default App 