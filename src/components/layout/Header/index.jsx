import { Menu } from 'lucide-react'

const Header = ({ toggleSidebar, activeModule }) => {
    
    const getModuleTitle = () => {
        const titles = {
        dashboard: 'Dashboard',
        usuarios: 'Gestión de Usuarios',
        clientes: 'Gestión de Clientes',
        maquila: 'Control de Maquila',
        ventas: 'Ventas y Cobranza',
        reportes: 'Reportes'
        }
        return titles[activeModule] || 'Dashboard';
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
            <button 
                onClick={toggleSidebar}
                className="lg:hidden text-gray-600 hover:text-gray-900"
            >
                <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{getModuleTitle()}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
                })}
            </div>
            </div>
        </div>
        </header>
    )
}

export default Header