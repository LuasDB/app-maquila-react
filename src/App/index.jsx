import React, { useState, createContext, useContext } from 'react'
import { Menu, X, UserCircle, Package, ShoppingCart, FileText, BarChart3, LogOut, Home } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Dashboard from '@/pages/Dashboard'
import Users from '@/pages/Users'
import { AuthProvider } from '@/context/AuthContext'





const ModulePlaceholder = ({ title }) => (
  <div className="bg-white rounded-lg shadow p-8 text-center">
    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
    <p className="text-gray-500">Este módulo está en desarrollo</p>
  </div>
);

// Componente principal
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch(activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'usuarios':
        return <Users />;
      case 'clientes':
        return <ModulePlaceholder title="Gestión de Clientes" />;
      case 'maquila':
        return <ModulePlaceholder title="Control de Maquila" />;
      case 'ventas':
        return <ModulePlaceholder title="Ventas y Cobranza" />;
      case 'reportes':
        return <ModulePlaceholder title="Reportes" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header 
            toggleSidebar={toggleSidebar}
            activeModule={activeModule}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;