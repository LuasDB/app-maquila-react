import { useState } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, UserCircle, Package, ShoppingCart, FileText, BarChart3, LogOut, Home } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false) 
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen) 

  const getActiveModule = ()=>{
    const path = location.pathname
    if(path.includes('usuarios')) return 'usuarios'
    if (path.includes('clientes')) return 'clientes' 
    if (path.includes('maquila')) return 'maquila' 
    if (path.includes('ventas')) return 'ventas' 
    if (path.includes('reportes')) return 'reportes' 
    if (path.includes('productos')) return 'productos' 
    return 'dashboard' 
  }
  const activeModule = getActiveModule()


  return (
  <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        activeModule={activeModule}
      />
      
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar}
          activeModule={activeModule}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  ) 
} 

export default AdminLayout 